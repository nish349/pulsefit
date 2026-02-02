
// Moved from lib/mockData.ts
// Preserving static content for UI sections
// removing 'pricingPlans' to enforce Database usage

export interface InventoryCategory {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  gridConfig: string;
  items: {
    name: string;
    count: number;
  }[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const team: TeamMember[] = [
  {
    id: 't1',
    name: 'Muhamad Fadli',
    role: 'Professional Coach',
    bio: 'With over 15 years in professional sports coaching, Fadli specializes in biomechanics and athlete psychological profiling.',
    image: '/demo-images/testimonial-1.jpg',
  },
  {
    id: 't2',
    name: 'Sarah Chen',
    role: 'Olympic Trainer',
    bio: 'Former Olympic physiotherapist dedicated to injury prevention and recovery strategies for elite performance.',
    image: '/demo-images/testimonial-2.jpg',
  },
  {
    id: 't3',
    name: 'Marcus Johnson',
    role: 'Gym Owner',
    bio: 'Founded PulseFit with a vision to integrate technology with traditional strength training.',
    image: '/demo-images/testimonial-3.jpg',
  },
];

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  time: string;
}

export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Jessica Lee',
    rating: 5,
    text: 'Hands down the best gym facility in the city. The equipment is top-tier and the atmosphere is electric.',
    time: '2 weeks ago',
  },
  {
    id: 'r2',
    author: 'David Smith',
    rating: 5,
    text: 'The AI assessment really helped me understand my training blocks. Highly recommended!',
    time: '1 month ago',
  },
  {
    id: 'r3',
    author: 'Emily Davis',
    rating: 4,
    text: 'Great recovery zone. The sauna and cold plunge are life savers after a heavy leg day.',
    time: '3 days ago',
  },
  {
    id: 'r4',
    author: 'Michael Brown',
    rating: 5,
    text: 'Staff is incredibly knowledgeable and the community is very supportive. Love the functional area.',
    time: '1 week ago',
  },
];

export const services = [
  {
    title: 'The Iron Pit',
    image: '/demo-images/heavy-zone.jpg',
    description: 'Heavy lifting zone with Olympic racks, dumbbells (up to 50kg), and deadlift platforms.',
  },
  {
    title: 'Cardio Deck',
    image: '/demo-images/cardio.jpg',
    description: 'Endurance station featuring advanced treadmills, ellipticals, and rowers with city views.',
  },
  {
    title: 'Rhythm Ride',
    image: '/demo-images/studio.jpg',
    description: 'High-intensity cycling synced to neon lights and bass-heavy beats.',
  },
];

export const faqs = [
  {
    question: "I'm a complete beginner. Will I feel out of place?",
    answer: "Honestly? No. We built PulseFit to be 'Ego-Free.' Every new member gets a free 30-minute orientation session where we show you exactly how to use the equipment so you never feel lost."
  },
  {
    question: "Is the gym super crowded in the evenings?",
    answer: "Like every gym, 6 PM - 8 PM is our peak time. However, you can check the 'Live Crowd Meter' on our website or app before you leave home to see exactly how busy we are in real-time."
  },
  {
    question: "Do I need to pay extra for Personal Training?",
    answer: "General gym access and group classes are included in your membership. 1-on-1 Personal Training is an add-on service, but we offer affordable packages and your first consultation is free."
  },
  {
    question: "What about parking?",
    answer: "We have a dedicated parking lot for members right outside. It's free for up to 2 hours while you workout, so you don't need to stress about finding a spot."
  },
  {
    question: "Do I need to bring my own padlock?",
    answer: "No need. Our lockers use digital keypad locks. You just set a 4-digit code when you close the door. It's secure and hassle-free."
  },
  {
    question: "Is it hard to cancel my membership?",
    answer: "We hate hidden contracts as much as you do. You can cancel anytime with just 30 days' notice directly through your member dashboard. No awkward phone calls required."
  },
  {
    question: "Can I freeze my membership if I travel?",
    answer: "Absolutely. We offer 'Hybrid Access' for travelers, which gives you on-demand workouts. If you need a complete break, you can freeze your membership for up to 3 months per year directly through the dashboard."
  },
  {
    question: "Do you offer guest passes?",
    answer: "Yes. Every member receives 2 complimentary 'VIP Guest Passes' per month to bring friends or family. Guests get full access to the Iron Pit, Cardio Deck, and general classes."
  }
];

export interface FacilityItem {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  gridConfig: string;
}

export const facilityCatalog: FacilityItem[] = [
  {
    id: 'iron-pit',
    title: 'The Iron Pit',
    description: 'Heavy lifting zone with Olympic racks, dumbbells (up to 50kg), and deadlift platforms.',
    backgroundImage: '/demo-images/heavy-zone.jpg',
    gridConfig: 'col-span-1 md:col-span-2 row-span-1',
  },
  {
    id: 'cardio-deck',
    title: 'Cardio Deck',
    description: 'Endurance station featuring advanced treadmills, ellipticals, and rowers with city views.',
    backgroundImage: '/demo-images/cardio.jpg',
    gridConfig: 'col-span-1 row-span-1',
  },
  {
    id: 'functional-area',
    title: 'Functional Training',
    description: 'Open turf space for kettlebells, battle ropes, and sled pushes.',
    backgroundImage: '/demo-images/functional.jpg',
    gridConfig: 'col-span-1 row-span-1',
  },
  {
    id: 'recovery-lounge',
    title: 'Recovery Lounge',
    description: 'Post-workout relaxation including steam, sauna, and premium shower suites.',
    backgroundImage: '/demo-images/recovery.jpg',
    gridConfig: 'col-span-1 md:col-span-2 row-span-1',
  },
  {
    id: 'rhythm-ride',
    title: 'Rhythm Ride',
    description: 'High-intensity cycling synced to neon lights and bass-heavy beats.',
    backgroundImage: '/demo-images/studio.jpg',
    gridConfig: 'col-span-1 row-span-1',
  },
  {
    id: 'power-yoga',
    title: 'Power Flow Yoga',
    description: 'Strength-based vinyasa yoga to build core stability and focus.',
    backgroundImage: '/demo-images/hero-right.jpg',
    gridConfig: 'col-span-1 row-span-1',
  },
  {
    id: 'combat-hiit',
    title: 'Combat HIIT',
    description: 'Boxing-inspired high-intensity interval training. No contact, max sweat.',
    backgroundImage: '/demo-images/testimonial-1.jpg',
    gridConfig: 'col-span-1 row-span-1',
  },
  {
    id: 'dance-fusion',
    title: 'Dance Fusion',
    description: 'High-energy dance cardio mixing Latin beats with modern hip-hop.',
    backgroundImage: '/demo-images/testimonial-2.jpg',
    gridConfig: 'col-span-1 md:col-span-2 row-span-1',
  },
  {
    id: 'power-pump',
    title: 'Power Pump',
    description: 'Full-body resistance workout using light weights and high reps.',
    backgroundImage: '/demo-images/testimonial-3.jpg',
    gridConfig: 'col-span-1 row-span-1',
  },
];

// MOCK data for Admin Dashboard until migrated
export interface MemberProfile {
  id: string;
  name: string;
  tier: 'Basic' | 'Business' | 'Enterprise';
  status: 'Active' | 'Frozen' | 'Cancelled';
  joinDate: string;
  aiAssessmentScore: number;
}

export const members: MemberProfile[] = [
  { id: 'm1', name: 'Alex Johnson', tier: 'Enterprise', status: 'Active', joinDate: '2023-01-15', aiAssessmentScore: 88 },
  { id: 'm2', name: 'Maria Garcia', tier: 'Basic', status: 'Frozen', joinDate: '2023-03-22', aiAssessmentScore: 72 },
  { id: 'm3', name: 'James Smith', tier: 'Business', status: 'Active', joinDate: '2023-02-10', aiAssessmentScore: 92 },
  { id: 'm4', name: 'Linda Brown', tier: 'Basic', status: 'Cancelled', joinDate: '2022-11-05', aiAssessmentScore: 65 },
  { id: 'm5', name: 'Robert Wilson', tier: 'Enterprise', status: 'Active', joinDate: '2023-04-01', aiAssessmentScore: 95 },
];

export const currentUser = {
  id: 'user_123',
  name: 'Nishant Singh',
  tier: 'Enterprise',
  accessMethod: 'qr', 
  activeStreak: 14,
  weightTrend: -2.5,
  nextClass: {
    name: 'Rhythm Ride',
    time: 'Tomorrow, 07:00 AM',
    instructor: 'Sarah Chen'
  }
};

export interface MaintenanceLog {
  id: string;
  deviceId: string;
  reportedBy: string;
  issue: string;
  severity: 'Low' | 'Critical';
  status: 'Operational' | 'Needs Service' | 'Broken';
  date: string;
}

export const maintenanceLogs: MaintenanceLog[] = [
  { id: 'log1', deviceId: 'TM-01', reportedBy: 'Staff', issue: 'Belt slipping', severity: 'Low', status: 'Needs Service', date: '2023-10-25' },
  { id: 'log2', deviceId: 'EL-03', reportedBy: 'Member', issue: 'Screen unresponsive', severity: 'Critical', status: 'Broken', date: '2023-10-26' },
  { id: 'log3', deviceId: 'row-02', reportedBy: 'Staff', issue: 'Routine Check', severity: 'Low', status: 'Operational', date: '2023-10-24' },
];

export interface FinancialRecord {
  id: string;
  type: 'Membership' | 'One-Time';
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  date: string;
}

export const financialRecords: FinancialRecord[] = [
  { id: 'tx1', type: 'Membership', amount: 5000, status: 'Paid', date: '2023-10-26' },
  { id: 'tx2', type: 'One-Time', amount: 1500, status: 'Paid', date: '2023-10-25' },
  { id: 'tx3', type: 'Membership', amount: 3000, status: 'Pending', date: '2023-10-27' },
  { id: 'tx4', type: 'Membership', amount: 8000, status: 'Failed', date: '2023-10-24' },
];
