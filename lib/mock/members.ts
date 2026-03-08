export type MemberStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'Frozen' | 'Cancelled';
export type MembershipTier = 'Basic' | 'Silver' | 'Gold' | 'Platinum';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  dateOfBirth: string;
  tier: MembershipTier;
  status: MemberStatus;
  joinDate: string;
  expiryDate: string;
  avatarColor: string;
  lastCheckIn?: string;
  recentPayments?: { amount: number; date: string; status: 'Success' | 'Failed' }[];
  notes?: string;
}

const FIRST_NAMES = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const AVATAR_COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500', 'bg-emerald-500',
  'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500',
  'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateMockMembers(count: number = 100): Member[] {
  const members: Member[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    
    // Determine Dates
    const joinDate = randomDate(new Date(2022, 0, 1), today);
    
    // Status Logic (weighted to make realistic)
    let status: MemberStatus = 'Active';
    let expiryDate = new Date();
    
    const rand = Math.random();
    if (rand < 0.6) {
      status = 'Active';
      // Expiring between 8 days and 1 year from now
      expiryDate = randomDate(new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000), new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000));
    } else if (rand < 0.75) {
      status = 'Expiring Soon';
      // Expiring between tomorrow and 7 days from now
      expiryDate = randomDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else if (rand < 0.85) {
      status = 'Expired';
      // Expired within the last 30 days
      expiryDate = randomDate(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000));
    } else if (rand < 0.95) {
      status = 'Frozen';
      // Expiry pushed out
      expiryDate = randomDate(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000));
    } else {
      status = 'Cancelled';
      expiryDate = randomDate(new Date(today.getTime() - 100 * 24 * 60 * 60 * 1000), new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000));
    }

    const tier = randomElement(['Basic', 'Basic', 'Silver', 'Silver', 'Silver', 'Gold', 'Gold', 'Platinum']);

    members.push({
      id: `MEM-${1000 + i}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      gender: randomElement(['Male', 'Female']),
      dateOfBirth: randomDate(new Date(1960, 0, 1), new Date(2005, 0, 1)).toISOString(),
      tier: tier as MembershipTier,
      status,
      joinDate: joinDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      avatarColor: randomElement(AVATAR_COLORS),
      lastCheckIn: Math.random() > 0.2 ? randomDate(new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000), today).toISOString() : undefined,
      recentPayments: [
        { amount: tier === 'Basic' ? 30 : tier === 'Silver' ? 50 : 80, date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), status: 'Success' },
      ],
      notes: Math.random() > 0.8 ? 'Needs follow-up regarding personal training options.' : undefined
    });
  }

  // Sort default by expiry ascending
  return members.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
}

export const MOCK_MEMBERS = generateMockMembers(150);
