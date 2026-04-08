// src/types/client.ts

export type ClientStatus = 'active' | 'inactive' | 'blocked' | 'prospect';
export type ClientType = 'vip' | 'regular' | 'partner';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: ClientStatus;
  type: ClientType;
  managerId: string;
  managerName: string;
  createdAt: string;
  lastContact: string;
  totalOrders: number;
  totalRevenue: number;
  avatar?: string;
  tags?: string[];
  notes?: string;
}

export interface ClientFilters {
  search?: string;
  type?: ClientType | 'all';
  status?: ClientStatus | 'all';
  managerId?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
}