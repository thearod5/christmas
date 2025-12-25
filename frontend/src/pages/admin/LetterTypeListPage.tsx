import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLetterTypeStore } from '../../stores/letterTypeStore';

export default function LetterTypeListPage() {
  const { letterTypes, isLoading, error, fetchLetterTypes, createLetterType, deleteLetterType } = useLetterTypeStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchLetterTypes();
  }, [fetchLetterTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLetterType({ name, description, meta_schema: {} });
      setName('');
      setDescription('');
      setShowForm(false);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this letter type?')) {
      await deleteLetterType(id);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Letter Types</h1>
        <div>
          <Link to="/admin/dashboard">
            <button style={{ marginRight: '10px' }}>Dashboard</button>
          </Link>
          <button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Create New Type'}</button>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>New Letter Type</h2>
          <div style={{ marginBottom: '15px' }}>
            <label>
              Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </label>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>
              Description:
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '8px', minHeight: '60px' }} />
            </label>
          </div>
          <button type="submit" disabled={isLoading}>
            Create
          </button>
        </form>
      )}

      {isLoading && <div>Loading...</div>}

      <div>
        {letterTypes.map((type) => (
          <div key={type.id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
            <h3>{type.name}</h3>
            <p>{type.description}</p>
            <p>
              <small>Slug: {type.slug}</small>
            </p>
            <button onClick={() => handleDelete(type.id)} style={{ marginTop: '10px' }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {letterTypes.length === 0 && !isLoading && <p>No letter types yet. Create your first one!</p>}
    </div>
  );
}
