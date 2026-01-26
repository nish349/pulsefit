import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GymStore {
  occupancy: number; // 0 to 100
  setOccupancy: (val: number) => void;
  accessMethod: 'qr' | 'biometric';
  setAccessMethod: (method: 'qr' | 'biometric') => void;
}

export const useGymStore = create<GymStore>()(
  persist(
    (set) => ({
      occupancy: 42, // Default starting value
      setOccupancy: (val) => set({ occupancy: val }),
      accessMethod: 'qr',
      setAccessMethod: (method) => set({ accessMethod: method }),
    }),
    {
      name: 'pulse-fit-gym-store', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), 
      skipHydration: true, // We'll handle hydration manually to avoid hydration mismatch if needed, but usually fine. Actually let's keep default hydration for simplicity first, but cross-tab usually needs a listener.
    }
  )
);

// Optional: Add a listener for cross-tab synchronization if 'persist' doesn't auto-sync in this version
if (typeof window !== 'undefined') {
  const channel = new BroadcastChannel('gym_sync_channel');
  
  // When state changes in this tab, post message
  useGymStore.subscribe((state) => {
    // runtime check to avoid cloning functions
    const { occupancy, accessMethod } = state; 
    channel.postMessage({ occupancy, accessMethod });
  });

  // When message received from other tab, update state
  channel.onmessage = (event) => {
    const currentState = useGymStore.getState();
    const newState = event.data;
    
    // Prevent infinite loops by only updating if value changed
    if (currentState.occupancy !== newState.occupancy || currentState.accessMethod !== newState.accessMethod) {
      useGymStore.setState({ 
        occupancy: newState.occupancy,
        accessMethod: newState.accessMethod ?? currentState.accessMethod // fallback if undefined in message
      });
    }
  };
}
