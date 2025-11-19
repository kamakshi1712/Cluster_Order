import { useState } from 'react';
import { Plus, LogOut, Users, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Cluster, AppOption } from '../types';
import CreateClusterModal from './CreateClusterModal';
import BrowseClusters from './BrowseClusters';
import ClusterDetails from './ClusterDetails';

const APP_COLORS: Record<AppOption, string> = {
  'Swiggy': 'bg-orange-500',
  'Zomato': 'bg-red-500',
  'Blinkit': 'bg-yellow-400',
  'Instamart': 'bg-green-500',
  'EatSure': 'bg-blue-500',
  "Domino's": 'bg-blue-600'
};

type View = 'my-clusters' | 'browse' | 'cluster-details';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { getUserClusters } = useData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentView, setCurrentView] = useState<View>('my-clusters');
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);

  const myClusters = getUserClusters();

  const handleClusterClick = (cluster: Cluster) => {
    setSelectedCluster(cluster);
    setCurrentView('cluster-details');
  };

  const handleBackToClusters = () => {
    setSelectedCluster(null);
    setCurrentView('my-clusters');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FoodCluster</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'cluster-details' && selectedCluster ? (
          <ClusterDetails cluster={selectedCluster} onBack={handleBackToClusters} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentView('my-clusters')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === 'my-clusters'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  My Clusters
                </button>
                <button
                  onClick={() => setCurrentView('browse')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === 'browse'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Browse Clusters
                </button>
              </div>

              {currentView === 'my-clusters' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Create Cluster
                </button>
              )}
            </div>

            {currentView === 'my-clusters' && (
              <div className="space-y-4">
                {myClusters.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No clusters yet</h3>
                    <p className="text-gray-500 mb-6">Create your first cluster to get started</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl font-semibold"
                    >
                      <Plus className="w-5 h-5" />
                      Create Cluster
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {myClusters.map((cluster) => (
                      <div
                        key={cluster.id}
                        onClick={() => handleClusterClick(cluster)}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`w-12 h-12 ${APP_COLORS[cluster.appName as AppOption]} rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform`}>
                            {cluster.appName[0]}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {cluster.name}
                            </h3>
                            <p className="text-sm text-gray-500">{cluster.appName}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{cluster.memberCount} members</span>
                          </div>
                          {cluster.ownerId === user?.id && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                              Owner
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentView === 'browse' && <BrowseClusters />}
          </>
        )}
      </main>

      {showCreateModal && <CreateClusterModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}
