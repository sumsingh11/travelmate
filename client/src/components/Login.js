import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if(res.data.user.role==="Admin"){
         navigate('/admin');
      }
      else
      navigate('/dashboard');
    } catch (err) {
      setErr(err.response?.data?.msg || 'Login failed.');
    }
  };

  return (
    <div className="container" style={{maxWidth: 400}}>
      <h2 className="mt-5 mb-4">Sign In</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
      <div className="text-center mt-3">
        <Link to="/register">Don't have an account? Register</Link>
      </div>
    </div>
  );
};

export default Login;
// This Login component handles user authentication.
// It allows users to log in with their email and password or through social media providers like Google and Facebook.
// Upon successful login, it stores the JWT token and user information in local storage and redirects to the dashboard.
// If there's an error during login, it displays an error message.
// The component uses React Router for navigation and Axios for API requests.
// The social login buttons redirect to the respective OAuth endpoints defined in the backend.