// src/store/useClientStore.ts
import { create } from 'zustand';
import type { Client } from '@/types/client';

interface ClientState {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
}

// Начальные данные
const initialClients: Client[] = [
  {
    id: '1',
    name: 'Иванов Иван Иванович',
    company: 'ООО "Вектор Принт"',
    email: 'ivanov@vectorprint.ru',
    phone: '+7 (999) 000-00-00',
    status: 'active',
    type: 'vip',
    managerId: 'm1',
    managerName: 'Иванов И.И.',
    createdAt: '2025-01-15',
    lastContact: '2026-04-08',
    totalOrders: 24,
    totalRevenue: 1250000,
    tags: ['Полиграфия', 'B2B', 'Постоянный'],
  },
  {
    id: '2',
    name: 'Смирнова Анна Петровна',
    company: 'ИП Смирнов А.В.',
    email: 'smirnova@example.ru',
    phone: '+7 (900) 123-45-67',
    status: 'active',
    type: 'regular',
    managerId: 'm1',
    managerName: 'Иванов И.И.',
    createdAt: '2025-02-20',
    lastContact: '2026-04-07',
    totalOrders: 8,
    totalRevenue: 245000,
    tags: ['Розница', 'Онлайн'],
  },
];

export const useClientStore = create<ClientState>((set) => ({
  clients: initialClients,
  addClient: (data) =>
    set((state) => ({
      clients: [
        ...state.clients,
        {
          ...data,
          id: `c_${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
    })),
}));