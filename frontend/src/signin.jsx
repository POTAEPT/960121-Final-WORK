import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="card shadow p-4 border-0" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
        <h2 className="text-center mb-4 fw-bold" style={{ color: 'var(--primary-color)' }}>Sign In</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input
              type="email" className="form-control form-control-lg" name="email"
              placeholder="name@example.com" value={formData.email}
              onChange={handleChange} required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password" className="form-control form-control-lg" name="password"
              placeholder="Enter your password" value={formData.password}
              onChange={handleChange} required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm" style={{ borderRadius: '10px' }} disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mt-4">
          <small className="text-muted">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-decoration-none fw-bold" style={{ color: 'var(--primary-color)' }}>Sign Up</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
