export interface LeetCodeData {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate?: string;
  ranking?: string;
  profileUrl: string;
}

export const LEETCODE_BASELINE: LeetCodeData = {
  username: 'Manas-5461X',
  totalSolved: 151,
  easySolved: 94,
  mediumSolved: 52,
  hardSolved: 5,
  profileUrl: 'https://leetcode.com/u/Manas-5461X/'
};
