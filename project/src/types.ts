export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface Cluster {
  id: string;
  name: string;
  appName: string;
  ownerId: string;
  ownerName: string;
  isActive: boolean;
  memberCount: number;
  createdAt: string;
}

export interface Order {
  id: string;
  clusterId: string;
  memberId: string;
  memberName: string;
  itemDescription: string;
  amount: number;
  status: 'pending' | 'received' | 'delivered';
  handoverCode?: string;
  markedReceivedAt?: string;
  createdAt: string;
}

export interface ClusterMember {
  id: string;
  clusterId: string;
  userId: string;
  userName: string;
  joinedAt: string;
}

export type AppOption = 'Swiggy' | 'Zomato' | 'Blinkit' | 'Instamart' | 'EatSure' | "Domino's";
