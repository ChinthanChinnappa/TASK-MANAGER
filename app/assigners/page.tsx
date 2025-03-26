'use client';

import { useState, useEffect } from 'react';

interface Assigner {
  id: number;
  name: string;
  email: string;
}

interface ErrorState {
  type: 'error' | 'success';
  message: string;
}

export default function AssignersPage() {
  const [assigners, setAssigners] = useState<Assigner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAssigner, setEditingAssigner] = useState<Assigner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const fetchAssigners = async () => {
    try {
      const response = await fetch('/api/v1/assigners');
      if (!response.ok) {
        setAssigners([]);
        return;
      }
      const data = await response.json();
      setAssigners(data.data || []);
    } catch (err) {
      console.error('Error fetching assigners:', err);
      setAssigners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingAssigner 
        ? `/api/v1/assigners/${editingAssigner.id}`
        : '/api/v1/assigners';
      
      const response = await fetch(url, {
        method: editingAssigner ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError({ type: 'error', message: data.message || `Failed to ${editingAssigner ? 'update' : 'create'} assigner` });
        return;
      }

      setError({ type: 'success', message: `Assigner ${editingAssigner ? 'updated' : 'created'} successfully` });
      setShowForm(false);
      setEditingAssigner(null);
      setFormData({ name: '', email: '' });
      fetchAssigners();
      
      // Clear success message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } catch (err) {
      setError({ type: 'error', message: 'An unexpected error occurred' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this assigner?')) return;

    try {
      const response = await fetch(`/api/v1/assigners/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setError({ type: 'error', message: data.message || 'Failed to delete assigner' });
        return;
      }

      setError({ type: 'success', message: 'Assigner deleted successfully' });
      fetchAssigners();
      
      // Clear success message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } catch (err) {
      setError({ 
        type: 'error', 
        message: 'An unexpected error occurred while deleting the assigner'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assigners</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your task assigners</p>
        </div>
        <button
          onClick={() => {
            setEditingAssigner(null);
            setFormData({ name: '', email: '' });
            setShowForm(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Assigner
        </button>
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

      {showForm && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAssigner(null);
                    setFormData({ name: '', email: '' });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingAssigner ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assigners.map((assigner) => (
              <tr key={assigner.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{assigner.name}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{assigner.email}</td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    onClick={() => {
                      setEditingAssigner(assigner);
                      setFormData({ name: assigner.name, email: assigner.email });
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(assigner.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 