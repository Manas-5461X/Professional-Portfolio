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
  totalSolved: 175,
  easySolved: 108,
  mediumSolved: 61,
  hardSolved: 6,
  ranking: '#1,088,892',
  profileUrl: 'https://leetcode.com/u/Manas-5461X/'
};
