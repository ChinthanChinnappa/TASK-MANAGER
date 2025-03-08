import { useState, useEffect } from 'react';
import AssignerForm from './AssignerForm';
import './AssignerList.css';

function AssignerList() {
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
    if (!window.confirm('Are you sure you want to delete this assigner?')) return;

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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="assigners-container">
      <div className="assigners-header">
        <h2>Assigners</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Assigner
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

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

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assigners.map((assigner) => (
              <tr key={assigner.id}>
                <td>{assigner.name}</td>
                <td>{assigner.email}</td>
                <td className="actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(assigner)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(assigner.id)}
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

export default AssignerList; 