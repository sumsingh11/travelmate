import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'

const Register = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Traveller');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async e => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password, role });
      setMsg('Registration successful. You may now log in.');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      console.error(err);
      setErr(err.response?.data?.msg || 'Registration failed.');
    }
  };

  return (
    <div className="container" style={{maxWidth: 400}}>
      <h2 className="mt-5 mb-4">Register</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Full Name"
            value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
            <option value="Traveller">Traveller</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-success w-100" type="submit">Register</button>
      </form>
      <div className="text-center mt-3">
        <Link to="/">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Register;
// This Register component allows users to create a new account.
// It collects the user's name, role, email, and password, and sends this data to the server for registration.
// If registration is successful, it displays a success message and redirects the user to the login page after a short delay.
// If there's an error during registration, it displays an error message.
// The component uses React Router's Link for navigation to the login page.
// It also uses Axios to make API requests to the backend for user registration.
// The role selection allows users to choose their role, which can be "Traveller", "Organizer", or "Admin".