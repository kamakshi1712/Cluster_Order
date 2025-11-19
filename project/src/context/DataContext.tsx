import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cluster, Order, ClusterMember, AppOption } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  clusters: Cluster[];
  orders: Order[];
  members: ClusterMember[];
  createCluster: (name: string, appName: AppOption) => void;
  joinCluster: (clusterId: string) => void;
  leaveCluster: (clusterId: string) => void;
  createOrder: (clusterId: string, itemDescription: string, amount: number) => void;
  markOrderReceived: (orderId: string) => string;
  getUserClusters: () => Cluster[];
  getClusterOrders: (clusterId: string) => Order[];
  getClusterMembers: (clusterId: string) => ClusterMember[];
  isUserClusterMember: (clusterId: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [members, setMembers] = useState<ClusterMember[]>([]);

  useEffect(() => {
    const storedClusters = localStorage.getItem('clusters');
    const storedOrders = localStorage.getItem('orders');
    const storedMembers = localStorage.getItem('members');

    if (storedClusters) setClusters(JSON.parse(storedClusters));
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    if (storedMembers) setMembers(JSON.parse(storedMembers));
  }, []);

  useEffect(() => {
    localStorage.setItem('clusters', JSON.stringify(clusters));
  }, [clusters]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  const createCluster = (name: string, appName: AppOption) => {
    if (!user) return;

    const newCluster: Cluster = {
      id: crypto.randomUUID(),
      name,
      appName,
      ownerId: user.id,
      ownerName: user.fullName,
      isActive: true,
      memberCount: 1,
      createdAt: new Date().toISOString()
    };

    setClusters(prev => [...prev, newCluster]);

    const newMember: ClusterMember = {
      id: crypto.randomUUID(),
      clusterId: newCluster.id,
      userId: user.id,
      userName: user.fullName,
      joinedAt: new Date().toISOString()
    };

    setMembers(prev => [...prev, newMember]);
  };

  const joinCluster = (clusterId: string) => {
    if (!user) return;

    const isAlreadyMember = members.some(
      m => m.clusterId === clusterId && m.userId === user.id
    );

    if (isAlreadyMember) return;

    const newMember: ClusterMember = {
      id: crypto.randomUUID(),
      clusterId,
      userId: user.id,
      userName: user.fullName,
      joinedAt: new Date().toISOString()
    };

    setMembers(prev => [...prev, newMember]);

    setClusters(prev =>
      prev.map(c =>
        c.id === clusterId ? { ...c, memberCount: c.memberCount + 1 } : c
      )
    );
  };

  const leaveCluster = (clusterId: string) => {
    if (!user) return;

    setMembers(prev =>
      prev.filter(m => !(m.clusterId === clusterId && m.userId === user.id))
    );

    setClusters(prev =>
      prev.map(c =>
        c.id === clusterId ? { ...c, memberCount: Math.max(0, c.memberCount - 1) } : c
      )
    );
  };

  const createOrder = (clusterId: string, itemDescription: string, amount: number) => {
    if (!user) return;

    const newOrder: Order = {
      id: crypto.randomUUID(),
      clusterId,
      memberId: user.id,
      memberName: user.fullName,
      itemDescription,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [...prev, newOrder]);
  };

  const generateHandoverCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const markOrderReceived = (orderId: string): string => {
    const handoverCode = generateHandoverCode();

    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: 'received' as const,
              handoverCode,
              markedReceivedAt: new Date().toISOString()
            }
          : order
      )
    );

    return handoverCode;
  };

  const getUserClusters = () => {
    if (!user) return [];

    const userClusterIds = members
      .filter(m => m.userId === user.id)
      .map(m => m.clusterId);

    return clusters.filter(c => userClusterIds.includes(c.id));
  };

  const getClusterOrders = (clusterId: string) => {
    return orders.filter(o => o.clusterId === clusterId);
  };

  const getClusterMembers = (clusterId: string) => {
    return members.filter(m => m.clusterId === clusterId);
  };

  const isUserClusterMember = (clusterId: string) => {
    if (!user) return false;
    return members.some(m => m.clusterId === clusterId && m.userId === user.id);
  };

  return (
    <DataContext.Provider
      value={{
        clusters,
        orders,
        members,
        createCluster,
        joinCluster,
        leaveCluster,
        createOrder,
        markOrderReceived,
        getUserClusters,
        getClusterOrders,
        getClusterMembers,
        isUserClusterMember
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
