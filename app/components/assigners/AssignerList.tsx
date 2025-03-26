import React, { useState } from 'react';

interface Assigner {
  id: string;
  name: string;
  email: string;
}

interface ErrorState {
  type: 'error' | 'success';
  message: string;
}

export default function AssignerList({ assigners }: { assigners: Assigner[] }) {
  const [assignersList, setAssignersList] = useState<Assigner[]>(assigners);
  const [error, setError] = useState<ErrorState | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/assigners/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setError({ type: 'error', message: data.message || 'Failed to delete assigner' });
        return;
      }

      setAssignersList(prev => prev.filter(assigner => assigner.id !== id));
      setError({ type: 'success', message: 'Assigner deleted successfully' });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting assigner:', err);
      setError({ type: 'error', message: 'An unexpected error occurred' });
    }
  };

  // ... existing code ...
} 