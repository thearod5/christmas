import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user?.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>Letters</h2>
          <p>Create and manage letters</p>
          <Link to="/admin/letters">
            <button style={{ marginTop: '10px' }}>Manage Letters</button>
          </Link>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>Letter Types</h2>
          <p>Configure letter templates</p>
          <Link to="/admin/letter-types">
            <button style={{ marginTop: '10px' }}>Manage Types</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
