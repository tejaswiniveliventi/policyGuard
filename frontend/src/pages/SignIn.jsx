import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import '../styles/auth.css';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAppStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🛡️ PolicyGuard</div>
          <h1>Sign In</h1>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/discovery">Start free assessment</Link>
        </p>
      </div>
    </div>
  );
}