import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlanWithDetails } from '@/types';

interface GymStore {
  occupancy: number; // 0 to 100
  setOccupancy: (val: number) => void;
  currentInside: number;
  setCurrentInside: (val: number) => void;
  maxCapacity: number;
  setMaxCapacity: (val: number) => void;
  accessMethod: 'qr' | 'biometric' | 'both';
  setAccessMethod: (method: 'qr' | 'biometric' | 'both') => void;
  
  // Plans
  plans: PlanWithDetails[];
  setPlans: (plans: PlanWithDetails[]) => void;
  updatePlan: (plan: PlanWithDetails) => void;

  // Maintenance
  systems: SystemStatus[];
  setSystems: (systems: SystemStatus[]) => void;
  updateSystem: (system: SystemStatus) => void;

  // Members
  members: any[]; // Using any for speed, ideally typed
  setMembers: (members: any[]) => void;

  // Leads
  leads: any[];
  setLeads: (leads: any[]) => void;

  // Staff
  staff: any[];
  setStaff: (staff: any[]) => void;
}

export interface SystemStatus {
  id: string;
  name: string;
  status: string;
  reportedAt: string;
}


// --- CRITICAL FIX: Initialize with EMPTY arrays ---
// This ensures we rely 100% on the Database or Server Actions.
const initialPlans: PlanWithDetails[] = []; 

const initialSystems: SystemStatus[] = [];

export const useGymStore = create<GymStore>()(
  persist(
    (set, get) => ({
      occupancy: 42,
      currentInside: 84,
      maxCapacity: 200,
      setOccupancy: (val) => set({ occupancy: val }),
      setCurrentInside: (val) => {
        const { maxCapacity } = get();
        set({ currentInside: val, occupancy: Math.min(100, Math.round((val / maxCapacity) * 100)) });
      },
      setMaxCapacity: (val) => {
        const { currentInside } = get();
        set({ maxCapacity: val, occupancy: Math.min(100, Math.round((currentInside / val) * 100)) });
      },
      accessMethod: 'qr',
      setAccessMethod: (method) => set({ accessMethod: method }),

      // Plans - Now starts Empty
      plans: initialPlans,
      setPlans: (plans) => set({ plans }),
      updatePlan: (updatedPlan) => set((state) => ({
          plans: state.plans.map(p => p.id === updatedPlan.id ? updatedPlan : p)
      })),

      // Maintenance - Now starts Empty
      systems: initialSystems,
      setSystems: (systems) => set({ systems }),
      updateSystem: (updatedSystem) => set((state) => ({
          systems: state.systems.map(s => s.id === updatedSystem.id ? updatedSystem : s)
      })),

      // New Modules
      members: [], 
      setMembers: (members) => set({ members }),
      
      leads: [],
      setLeads: (leads) => set({ leads }),

      staff: [],
      setStaff: (staff) => set({ staff }),
    }),
    {
      name: 'pulse-fit-gym-store', 
      storage: createJSONStorage(() => localStorage), 
      skipHydration: true, 
    }
  )
);

// SYNC ENGINE (Optional - Keep this if you use it for other sync features)
if (typeof window !== 'undefined') {
  const channel = new BroadcastChannel('gym_sync_channel');
  
  // Cross Tab Receive
  channel.onmessage = (event) => {
      useGymStore.setState(event.data);
  };
}