import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLetterStore } from '../../stores/letterStore';

export default function LetterListPage() {
  const { letters, isLoading, error, fetchLetters, deleteLetter } = useLetterStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this letter?')) {
      await deleteLetter(id);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Letters</h1>
        <div>
          <Link to="/admin/dashboard">
            <button style={{ marginRight: '10px' }}>Dashboard</button>
          </Link>
          <Link to="/admin/letters/new">
            <button>Create New Letter</button>
          </Link>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      {isLoading && <div>Loading...</div>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '10px' }}>Title</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Recipient</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Type</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Published</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {letters.map((letter) => (
            <tr key={letter.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{letter.title}</td>
              <td style={{ padding: '10px' }}>{letter.recipient_name}</td>
              <td style={{ padding: '10px' }}>{letter.letter_type.name}</td>
              <td style={{ padding: '10px' }}>{letter.is_published ? 'Yes' : 'No'}</td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => navigate(`/admin/letters/${letter.id}/edit`)} style={{ marginRight: '5px' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(letter.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {letters.length === 0 && !isLoading && <p>No letters yet. Create your first one!</p>}
    </div>
  );
}
