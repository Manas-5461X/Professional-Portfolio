/**
 * Serverless LeetCode Stats Proxy
 * Retrieves live algorithmic submission stats from LeetCode GraphQL API.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => this;
}

export default async function handler(req: IncomingMessage, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    res.status(200).json({ ok: true });
    return;
  }

  const query = `query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }`;

  try {
    const upstream = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: JSON.stringify({ query, variables: { username: 'Manas-5461X' } })
    });

    if (!upstream.ok) {
      res.status(200).json({
        totalSolved: 151,
        easySolved: 94,
        mediumSolved: 52,
        hardSolved: 5
      });
      return;
    }

    const json = (await upstream.json()) as {
      data?: {
        matchedUser?: {
          submitStatsGlobal?: {
            acSubmissionNum?: { difficulty: string; count: number }[];
          };
        };
      };
    };
    const acSubmissions = json?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];

    const stats = {
      totalSolved: acSubmissions.find((x: { difficulty: string }) => x.difficulty === 'All')?.count || 151,
      easySolved: acSubmissions.find((x: { difficulty: string }) => x.difficulty === 'Easy')?.count || 94,
      mediumSolved: acSubmissions.find((x: { difficulty: string }) => x.difficulty === 'Medium')?.count || 52,
      hardSolved: acSubmissions.find((x: { difficulty: string }) => x.difficulty === 'Hard')?.count || 5
    };

    res.status(200).json(stats);
  } catch {
    // Fallback gracefully
    res.status(200).json({
      totalSolved: 151,
      easySolved: 94,
      mediumSolved: 52,
      hardSolved: 5
    });
  }
}
