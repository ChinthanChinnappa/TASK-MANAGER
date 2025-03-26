'use client';

import { useState, useEffect } from 'react';

interface AssignerStats {
  assigner_id: number;
  assigner_name: string;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
}

interface StatusStats {
  pending: number;
  in_progress: number;
  completed: number;
  total_tasks: number;
}

interface ErrorState {
  type: 'error' | 'success';
  message: string;
}

export default function StatsPage() {
  const [assignerStats, setAssignerStats] = useState<AssignerStats[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [assignerResponse, statusResponse] = await Promise.all([
          fetch('/api/v1/stats/tasks_by_assigner'),
          fetch('/api/v1/stats/tasks_by_status')
        ]);

        if (!assignerResponse.ok || !statusResponse.ok) {
          setAssignerStats([]);
          setStatusStats(null);
          return;
        }

        const assignerData = await assignerResponse.json();
        const statusData = await statusResponse.json();

        setAssignerStats(assignerData.stats || []);
        setStatusStats(statusData.stats || null);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setAssignerStats([]);
        setStatusStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Task Statistics</h2>
        <p className="mt-1 text-sm text-gray-500">Overview of task assignments and progress</p>
      </div>

      {error && (
        <div className={`rounded-md p-4 ${
          error.type === 'success' ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex">
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                error.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {error.type === 'success' ? 'Success' : 'Error'}
              </h3>
              <div className={`mt-2 text-sm ${
                error.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {error.message}
              </div>
            </div>
          </div>
        </div>
      )}

      {statusStats && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Tasks by Status</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
              <div className="bg-gray-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{statusStats.total_tasks}</dd>
                </div>
              </div>
              <div className="bg-yellow-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-yellow-800 truncate">Pending</dt>
                  <dd className="mt-1 text-3xl font-semibold text-yellow-900">{statusStats.pending}</dd>
                </div>
              </div>
              <div className="bg-blue-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-blue-800 truncate">In Progress</dt>
                  <dd className="mt-1 text-3xl font-semibold text-blue-900">{statusStats.in_progress}</dd>
                </div>
              </div>
              <div className="bg-green-50 overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-green-800 truncate">Completed</dt>
                  <dd className="mt-1 text-3xl font-semibold text-green-900">{statusStats.completed}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Tasks by Assigner</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Assigner</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Tasks</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Completed</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pending</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assignerStats.map((stat) => (
                  <tr key={stat.assigner_id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {stat.assigner_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{stat.total_tasks}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-green-600">{stat.completed_tasks}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-yellow-600">{stat.pending_tasks}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {stat.total_tasks > 0
                        ? `${Math.round((stat.completed_tasks / stat.total_tasks) * 100)}%`
                        : '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 