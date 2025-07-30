import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (success) {
      onSuccess();
    } else {
      setError('Invalid email or password');
    }
    
    setLoading(false);
  };

  const handleDemoLogin = async (userType: 'admin' | 'user') => {
    setLoading(true);
    setError('');
    
    const credentials = {
      admin: { email: 'admin@deshideal.com', password: 'admin123' },
      user: { email: 'user@deshideal.com', password: 'user123' }
    };
    
    const success = await login(credentials[userType].email, credentials[userType].password);
    
    if (success) {
      onSuccess();
    } else {
      setError('Demo login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-center text-gray-600 mb-6">Sign in to your DeshiDeal account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-medium text-black hover:underline"
            >
              Create one
            </button>
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3 text-center">Demo Accounts</h3>
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="w-full"
            >
              Login as Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('user')}
              disabled={loading}
              className="w-full"
            >
              Login as User
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p><strong>Admin:</strong> admin@deshideal.com / admin123</p>
            <p><strong>User:</strong> user@deshideal.com / user123</p>
          </div>
        </div>
      </form>
    </div>
  );
};