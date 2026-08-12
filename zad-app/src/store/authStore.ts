import { create } from 'zustand';
import { ProfileData, Address } from '../types';

const defaultProfile: ProfileData = {
  name: 'ميس العوام',
  email: 'com@gmail.alawammais',
  phone: '+963 911 111 111',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=90',
  points: 1250,
  orders: 12,
  balance: 45000,
  isGold: true,
};

const defaultAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'البيت',
    address: 'السويداء - العجيلات',
    details: 'بجانب مدرسة المتفوقين، بناء الياسمين ط3',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'العمل',
    address: 'السويداء - شارع المحوري',
    details: 'بناء البرج التجاري، ط4، مكتب 12',
    isDefault: false,
  },
];

interface AuthState {
  isAuthenticated: boolean;
  profile: ProfileData;
  addresses: Address[];
  selectedPaymentMethod: string;
  login: () => void;
  logout: () => void;
  setProfile: (profile: ProfileData) => void;
  updateProfile: (data: Partial<ProfileData>) => void;
  addBalance: (amount: number) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setSelectedPaymentMethod: (method: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  profile: defaultProfile,
  addresses: defaultAddresses,
  selectedPaymentMethod: 'cod',

  login: () => {
    set({ isAuthenticated: true });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      profile: {
        ...defaultProfile,
        name: 'زائر',
        email: '',
      },
    });
  },

  setProfile: (profile) => {
    set({ profile });
  },

  updateProfile: (data) => {
    set((state) => ({
      profile: { ...state.profile, ...data },
    }));
  },

  addBalance: (amount) => {
    set((state) => ({
      profile: { ...state.profile, balance: state.profile.balance + amount },
    }));
  },

  addAddress: (newAddr) => {
    const id = `addr-${Date.now()}`;
    set((state) => {
      const isFirst = state.addresses.length === 0;
      return {
        addresses: [
          ...state.addresses,
          { ...newAddr, id, isDefault: isFirst || newAddr.isDefault },
        ],
      };
    });
  },

  deleteAddress: (id) => {
    set((state) => ({
      addresses: state.addresses.filter((a) => a.id !== id),
    }));
  },

  setDefaultAddress: (id) => {
    set((state) => ({
      addresses: state.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    }));
  },

  setSelectedPaymentMethod: (method) => {
    set({ selectedPaymentMethod: method });
  },
}));
