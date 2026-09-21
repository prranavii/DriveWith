import { create } from 'zustand';

export type UserRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profilePhoto?: string;
  vehicles?: {
    id: string;
    make: string;
    model: string;
    transmission: 'AUTOMATIC' | 'MANUAL';
    licensePlate: string;
  }[];
  savedLocations?: {
    id: string;
    label: string;
    address: string;
  }[];
}

const DEFAULT_USER: UserProfile = {
  id: 'c1010000-0000-0000-0000-000000000001',
  name: 'Pranav Sharma',
  email: 'pranav@drivewith.ai',
  phone: '+91 98765 43210',
  role: 'CUSTOMER',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  vehicles: [
    { id: 'v1', make: 'Honda', model: 'City VX', transmission: 'AUTOMATIC', licensePlate: 'UP16 AB 1234' },
    { id: 'v2', make: 'Maruti', model: 'Swift ZXi', transmission: 'MANUAL', licensePlate: 'DL01 XY 9876' },
  ],
  savedLocations: [
    { id: 'l1', label: 'Home', address: 'Sector 62, Noida, UP' },
    { id: 'l2', label: 'Office', address: 'DLF Cyber City, Gurgaon, HR' },
    { id: 'l3', label: 'Airport', address: 'IGI Airport T3, New Delhi' },
  ],
};

// Helper to load stored auth state
const getStoredAuth = (): { isAuthenticated: boolean; user: UserProfile | null } => {
  try {
    const raw = localStorage.getItem('drivewith_auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.user) {
        return { isAuthenticated: true, user: parsed.user };
      }
    }
  } catch (err) {}
  return { isAuthenticated: false, user: null };
};

interface AppState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  currentRole: UserRole;
  activeBooking: any | null;
  driverLocation: { lat: number; lng: number } | null;
  agentLogs: any[];

  login: (user?: Partial<UserProfile>) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  setActiveBooking: (booking: any | null) => void;
  setDriverLocation: (loc: { lat: number; lng: number }) => void;
  addAgentLog: (log: any) => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
}

const initialAuth = getStoredAuth();

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: initialAuth.isAuthenticated,
  user: initialAuth.user,
  currentRole: initialAuth.user?.role || 'CUSTOMER',
  activeBooking: null,
  driverLocation: { lat: 28.5355, lng: 77.3910 },
  agentLogs: [
    { id: '1', agent_name: 'Concierge Agent', action_name: 'EXACTED_BOOKING_INTENT', details: { pickup: 'Sector 62 Noida', destination: 'Cyber City Gurgaon' }, created_at: new Date().toISOString() },
    { id: '2', agent_name: 'Matching Agent', action_name: 'EXPLAINED_SELECTION', details: { driver: 'Rajesh Kumar', score: 94.8 }, created_at: new Date().toISOString() },
  ],

  login: (userData) => {
    const mergedUser: UserProfile = {
      ...DEFAULT_USER,
      ...userData,
    };
    localStorage.setItem('drivewith_auth', JSON.stringify({ user: mergedUser }));
    set({
      isAuthenticated: true,
      user: mergedUser,
      currentRole: mergedUser.role,
    });
  },

  logout: () => {
    localStorage.removeItem('drivewith_auth');
    set({
      isAuthenticated: false,
      user: null,
      currentRole: 'CUSTOMER',
      activeBooking: null,
    });
  },

  setRole: (role) => set({ currentRole: role }),
  setActiveBooking: (booking) => set({ activeBooking: booking }),
  setDriverLocation: (loc) => set({ driverLocation: loc }),
  addAgentLog: (log) => set((state) => ({ agentLogs: [log, ...state.agentLogs] })),
  
  updateProfile: (updatedData) =>
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updatedData };
      localStorage.setItem('drivewith_auth', JSON.stringify({ user: newUser }));
      return { user: newUser };
    }),
}));
