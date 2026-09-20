import { create } from 'zustand';

export type UserRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN';

interface AppState {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  activeBooking: any | null;
  setActiveBooking: (booking: any | null) => void;
  driverLocation: { lat: number; lng: number } | null;
  setDriverLocation: (loc: { lat: number; lng: number }) => void;
  agentLogs: any[];
  addAgentLog: (log: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentRole: 'CUSTOMER',
  setRole: (role) => set({ currentRole: role }),
  activeBooking: null,
  setActiveBooking: (booking) => set({ activeBooking: booking }),
  driverLocation: { lat: 28.5355, lng: 77.3910 },
  setDriverLocation: (loc) => set({ driverLocation: loc }),
  agentLogs: [
    { id: '1', agent_name: 'Concierge Agent', action_name: 'EXACTED_BOOKING_INTENT', details: { pickup: 'Sector 62 Noida', destination: 'Cyber City Gurgaon' }, created_at: new Date().toISOString() },
    { id: '2', agent_name: 'Matching Agent', action_name: 'EXPLAINED_SELECTION', details: { driver: 'Rajesh Kumar', score: 94.8 }, created_at: new Date().toISOString() },
  ],
  addAgentLog: (log) => set((state) => ({ agentLogs: [log, ...state.agentLogs] })),
}));
