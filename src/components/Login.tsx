import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = login(username, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  // New function to handle clicking on demo credentials
  const handleCredentialClick = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(''); // Clear any previous errors
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      {/* Floating Demo Credentials Note */}
      <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-xl max-w-xs border border-gray-200">
        <p className="text-sm font-semibold text-gray-800 mb-3 text-center">Demo Credentials</p>
        <div className="space-y-2 text-xs">
          <div 
            className="bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleCredentialClick('marketing', '12345')}
          >
            <p><span className="font-medium">Marketing:</span> marketing / 12345</p>
          </div>
          <div 
            className="bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleCredentialClick('operational', '12345')}
          >
            <p><span className="font-medium">Operational:</span> operational / 12345</p>
          </div>
          <div 
            className="bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleCredentialClick('hrd', '12345')}
          >
            <p><span className="font-medium">HRD:</span> hrd / 12345</p>
          </div>
          <div 
            className="bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleCredentialClick('pengadaan', '12345')}
          >
            <p><span className="font-medium">Pengadaan:</span> pengadaan / 12345</p>
          </div>
          <div 
            className="bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleCredentialClick('finance', '12345')}
          >
            <p><span className="font-medium">Finance:</span> finance / 12345</p>
          </div>
          <div 
            className="bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleCredentialClick('gudang', '12345')}
          >
            <p><span className="font-medium">Gudang:</span> gudang / 12345</p>
          </div>
          <div 
            className="bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleCredentialClick('management', '12345')}
          >
            <p><span className="font-medium">Management:</span> management / 12345</p>
          </div>
          <div 
            className="bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleCredentialClick('qhse', '12345')}
          >
            <p><span className="font-medium">QHSE:</span> qhse / 12345</p>
          </div>
          <div 
            className="bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleCredentialClick('accounting', '12345')}
          >
            <p><span className="font-medium">Accounting:</span> accounting / 12345</p>
          </div>
          <div 
            className="bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleCredentialClick('tax', '12345')}
          >
            <p><span className="font-medium">Tax:</span> tax / 12345</p>
          </div>
          <div 
            className="bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleCredentialClick('procon', '12345')}
          >
            <p><span className="font-medium">Procon:</span> procon / 12345</p>
          </div>
        </div>
      </div>

      {/* Original Login Form Card */}
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg px-8 py-12">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">ERP System</h2>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
