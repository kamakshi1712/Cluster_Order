import { useState } from 'react';
import { ArrowLeft, Users, Plus, Package, X, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Cluster, AppOption } from '../types';

interface ClusterDetailsProps {
  cluster: Cluster;
  onBack: () => void;
}

const APP_COLORS: Record<AppOption, string> = {
  'Swiggy': 'bg-orange-500',
  'Zomato': 'bg-red-500',
  'Blinkit': 'bg-yellow-400',
  'Instamart': 'bg-green-500',
  'EatSure': 'bg-blue-500',
  "Domino's": 'bg-blue-600'
};

export default function ClusterDetails({ cluster, onBack }: ClusterDetailsProps) {
  const { user } = useAuth();
  const { getClusterOrders, getClusterMembers, createOrder, markOrderReceived, leaveCluster } = useData();
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [itemDescription, setItemDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [handoverCode, setHandoverCode] = useState<string | null>(null);

  const orders = getClusterOrders(cluster.id);
  const members = getClusterMembers(cluster.id);
  const isOwner = user?.id === cluster.ownerId;

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemDescription.trim() && amount) {
      createOrder(cluster.id, itemDescription, parseFloat(amount));
      setItemDescription('');
      setAmount('');
      setShowAddOrder(false);
    }
  };

  const handleMarkReceived = (orderId: string) => {
    const code = markOrderReceived(orderId);
    setHandoverCode(code);
  };

  const handleLeaveCluster = () => {
    if (confirm('Are you sure you want to leave this cluster?')) {
      leaveCluster(cluster.id);
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 ${APP_COLORS[cluster.appName as AppOption]} rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
              {cluster.appName[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{cluster.name}</h1>
              <p className="text-gray-500">{cluster.appName}</p>
            </div>
          </div>
        </div>
        {!isOwner && (
          <button
            onClick={handleLeaveCluster}
            className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            Leave
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Members</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{members.length}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Package className="w-5 h-5" />
            <span className="text-sm font-medium">Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <span className="text-sm font-medium">Total Amount</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{orders.reduce((sum, o) => sum + o.amount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Members</h2>
        </div>
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold">
                {member.userName[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{member.userName}</p>
                {member.userId === cluster.ownerId && (
                  <span className="text-xs text-orange-600 font-medium">Owner</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Orders</h2>
          <button
            onClick={() => setShowAddOrder(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Order
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No orders yet. Be the first to add one!
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{order.itemDescription}</p>
                    <p className="text-sm text-gray-500">by {order.memberName}</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">₹{order.amount.toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      order.status === 'received'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.status === 'received' ? 'Order Received' : 'Pending'}
                  </span>

                  {isOwner && order.status === 'pending' && (
                    <button
                      onClick={() => handleMarkReceived(order.id)}
                      className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Received
                    </button>
                  )}
                </div>

                {order.handoverCode && order.status === 'received' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Handover Code:</p>
                    <p className="text-2xl font-bold text-orange-600 tracking-wider">
                      {order.handoverCode}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Add Your Order</h3>
              <button
                onClick={() => setShowAddOrder(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Description
                </label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 2x Margherita Pizza"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddOrder(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Add Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {handoverCode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Marked as Received!</h3>
            <p className="text-gray-600 mb-6">Share this code when handing over the item:</p>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
              <p className="text-4xl font-bold text-orange-600 tracking-wider">{handoverCode}</p>
            </div>
            <button
              onClick={() => setHandoverCode(null)}
              className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
