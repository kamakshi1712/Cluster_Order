import { useState } from 'react';
import { X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { AppOption } from '../types';

interface CreateClusterModalProps {
  onClose: () => void;
}

const APP_OPTIONS: AppOption[] = ['Swiggy', 'Zomato', 'Blinkit', 'Instamart', 'EatSure', "Domino's"];

const APP_COLORS: Record<AppOption, string> = {
  'Swiggy': 'bg-orange-500',
  'Zomato': 'bg-red-500',
  'Blinkit': 'bg-yellow-400',
  'Instamart': 'bg-green-500',
  'EatSure': 'bg-blue-500',
  "Domino's": 'bg-blue-600'
};

export default function CreateClusterModal({ onClose }: CreateClusterModalProps) {
  const [clusterName, setClusterName] = useState('');
  const [selectedApp, setSelectedApp] = useState<AppOption | null>(null);
  const { createCluster } = useData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clusterName.trim() && selectedApp) {
      createCluster(clusterName, selectedApp);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create New Cluster</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cluster Name
            </label>
            <input
              type="text"
              value={clusterName}
              onChange={(e) => setClusterName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="e.g., Office Lunch Group"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Food App
            </label>
            <div className="grid grid-cols-2 gap-3">
              {APP_OPTIONS.map((app) => (
                <button
                  key={app}
                  type="button"
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedApp === app
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow'
                  }`}
                >
                  <div className={`w-12 h-12 ${APP_COLORS[app]} rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl`}>
                    {app[0]}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{app}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!clusterName.trim() || !selectedApp}
              className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              Create Cluster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
