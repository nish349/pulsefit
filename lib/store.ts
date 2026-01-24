import { create } from 'zustand';

interface GymStore {
  crowdCount: number;
  occupancyStatus: 'Low' | 'Medium' | 'High';
  setCrowdCount: (count: number) => void;
}

export const useGymStore = create<GymStore>((set) => ({
  crowdCount: 102,
  occupancyStatus: 'Medium',
  setCrowdCount: (count) => set({ 
    crowdCount: count, 
    occupancyStatus: count < 30 ? 'Low' : count < 70 ? 'Medium' : 'High' 
  }),
}));
