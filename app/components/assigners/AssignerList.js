import { useState, useEffect } from 'react';
import AssignerForm from './AssignerForm';

export default function AssignerList() {
  const [assigners, setAssigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAssigner, setEditingAssigner] = useState(null);

  const fetchAssigners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/assigners');
      if (!response.ok) {
        throw new Error('Failed to fetch assigners');
      }
      const data = await response.json();
      setAssigners(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching assigners:', err);
      setError('Failed to load assigners. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigners();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this assigner?')) return;

    try {
      setError(null);
      const response = await fetch(`/api/v1/assigners/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete assigner');
      }

      // Show success message
      setError({ type: 'success', message: data.message || 'Assigner deleted successfully' });
      // Refresh the assigners list
      fetchAssigners();
    } catch (err) {
      console.error('Error deleting assigner:', err);
      setError({ type: 'error', message: err.message });
    } finally {
      // Clear any message after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleEdit = (assigner) => {
    setEditingAssigner(assigner);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save assigner');
      }

      setShowForm(false);
      setEditingAssigner(null);
      fetchAssigners();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    const isSuccess = error.type === 'success';
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Assigners</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Assigner
          </button>
        </div>

        <div 
          className={`${
            isSuccess ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          } px-4 py-3 rounded relative border`} 
          role="alert"
        >
          <p className="font-bold">{isSuccess ? 'Success' : 'Error'}</p>
          <p className="text-sm">{error.message}</p>
        </div>

        {/* Continue showing the table even when there's an error message */}
        {assigners.length > 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assigners.map((assigner) => (
                  <tr key={assigner.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assigner.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assigner.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(assigner)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 focus:outline-none focus:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(assigner.id)}
                        className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  const hasAssigners = assigners.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Assigners</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Assigner
        </button>
      </div>

      {showForm && (
        <AssignerForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingAssigner(null);
          }}
          initialData={editingAssigner}
        />
      )}

      {!hasAssigners && !showForm ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">No assigners found</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Add your first assigner
          </button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assigners.map((assigner) => (
                <tr key={assigner.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assigner.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assigner.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(assigner)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 focus:outline-none focus:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(assigner.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 