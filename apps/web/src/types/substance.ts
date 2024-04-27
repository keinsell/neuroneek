export interface Substance {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export const SUBSTANCES_MOCKUP: Substance[] = [
  {
    id: 1,
    name: 'LSD',
    description: 'Lysergic acid diethylamide',
    createdAt: '2023-04-15T00:00:00.000',
    updatedAt: '2023-04-15T00:00:00.000',
    version: 1,
  },
];
