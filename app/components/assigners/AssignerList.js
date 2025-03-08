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
      const response = await fetch('/api/v1/assigners');
      if (!response.ok) {
        throw new Error('Failed to fetch assigners');
      }
      const data = await response.json();
      setAssigners(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
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
      const response = await fetch(`/api/v1/assigners/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete assigner');
      }

      fetchAssigners();
    } catch (err) {
      setError(err.message);
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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Assigners</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
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