import { NextRequest, NextResponse } from 'next/server';
import { fetchLeetCodeProfile, formatLeetCodeSubmissionToProblem } from '@/lib/leetcode';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: 'LeetCode username is required' },
        { status: 400 }
      );
    }

    const profileData = await fetchLeetCodeProfile(username);
    const fetchedProblems = profileData.recentSubmissions.map((sub, i) =>
      formatLeetCodeSubmissionToProblem(sub, i)
    );

    return NextResponse.json({
      success: true,
      profile: profileData,
      fetchedProblems,
    });
  } catch (error: any) {
    console.error('LeetCode Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch LeetCode profile' },
      { status: 500 }
    );
  }
}
