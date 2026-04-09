export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  status: 'active' | 'vip' | 'inactive';
  createdAt: string;
}