import { Users, ShoppingBag } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { AppOption } from '../types';

const APP_COLORS: Record<AppOption, string> = {
  'Swiggy': 'bg-orange-500',
  'Zomato': 'bg-red-500',
  'Blinkit': 'bg-yellow-400',
  'Instamart': 'bg-green-500',
  'EatSure': 'bg-blue-500',
  "Domino's": 'bg-blue-600'
};

export default function BrowseClusters() {
  const { clusters, joinCluster, isUserClusterMember } = useData();
  const { user } = useAuth();

  const availableClusters = clusters.filter(
    c => c.isActive && !isUserClusterMember(c.id)
  );

  if (availableClusters.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No clusters available</h3>
        <p className="text-gray-500">Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Available Clusters</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {availableClusters.map((cluster) => (
          <div
            key={cluster.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${APP_COLORS[cluster.appName as AppOption]} rounded-lg flex items-center justify-center text-white font-bold`}>
                  {cluster.appName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{cluster.name}</h3>
                  <p className="text-sm text-gray-500">{cluster.appName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{cluster.memberCount} members</span>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-4">
              Created by {cluster.ownerName}
            </div>

            <button
              onClick={() => joinCluster(cluster.id)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Join Cluster
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
