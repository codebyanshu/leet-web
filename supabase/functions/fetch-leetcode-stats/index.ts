import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import {createClient} from "@supabase/supabase-js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Optionally verify authentication when SUPABASE env vars are provided.
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        console.error('Missing authorization header');
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Verify the JWT token
      const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      });

      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        console.error('Invalid authentication:', authError?.message);
        return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      // If env not configured, allow unauthenticated requests (developer convenience).
      console.warn('SUPABASE_URL or SUPABASE_ANON_KEY not set; skipping Supabase auth (dev mode).');
    }

    const { username } = await req.json();
    
    if (!username) {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate username format - alphanumeric, underscores, and hyphens only, max 50 chars
    const usernameRegex = /^[a-zA-Z0-9_-]{1,50}$/;
    if (!usernameRegex.test(username)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid username format. Use only letters, numbers, underscores, and hyphens (max 50 characters).' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching LeetCode stats for: ${username}`);

    // LeetCode GraphQL endpoint
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                realName
                ranking
                reputation
                starRating
              }
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
            userContestRanking(username: $username) {
              attendedContestsCount
              rating
              globalRanking
            }
          }
        `,
        variables: { username },
      }),
    });

    const data = await response.json();
    console.log('LeetCode API response received');

    if (!data.data?.matchedUser) {
      return new Response(JSON.stringify({ error: 'User not found on LeetCode' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const lcUser = data.data.matchedUser;
    const contestData = data.data.userContestRanking;
    const submissions = lcUser.submitStatsGlobal?.acSubmissionNum || [];

    // Extract solved counts by difficulty
    const easySolved = submissions.find((s: any) => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = submissions.find((s: any) => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = submissions.find((s: any) => s.difficulty === 'Hard')?.count || 0;
    const totalSolved = submissions.find((s: any) => s.difficulty === 'All')?.count || (easySolved + mediumSolved + hardSolved);

    const stats = {
      username: lcUser.username,
      avatar: `https://assets.leetcode.com/users/avatars/avatar_${lcUser.username}.png`,
      ranking: lcUser.profile?.ranking || 0,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      contestRating: Math.round(contestData?.rating || 0),
      contestRanking: contestData?.globalRanking || 0,
      streak: 0, // LeetCode doesn't expose streak in public API
      reputation: lcUser.profile?.reputation || 0,
    };

    // Try to get streak from calendar API
    try {
      const streakResponse = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
        },
        body: JSON.stringify({
          query: `
            query userProfileCalendar($username: String!, $year: Int) {
              matchedUser(username: $username) {
                userCalendar(year: $year) {
                  streak
                  totalActiveDays
                }
              }
            }
          `,
          variables: { username, year: new Date().getFullYear() },
        }),
      });

      const streakData = await streakResponse.json();
      if (streakData.data?.matchedUser?.userCalendar?.streak) {
        stats.streak = streakData.data.matchedUser.userCalendar.streak;
      }
    } catch (e) {
      console.log('Could not fetch streak data');
    }

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return new Response(JSON.stringify({ error: 'Unable to fetch user statistics. Please try again later.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
