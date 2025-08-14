import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Factory, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const demoUsers = [
    { id: 'operator@company.com', name: 'P. Charuchinda', role: 'Operator' },
    { id: 'qc@company.com', name: 'P. Charuchinda', role: 'QC Inspector' },
    { id: 'superadmin@company.com', name: 'P. Charuchinda', role: 'Super Admin' },
    { id: 'viewer@company.com', name: 'P. Charuchinda', role: 'Viewer' },
  ];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedUser) {
      setError('กรุณาเลือกผู้ใช้เพื่อดำเนินการต่อ');
      return;
    }
    
    const success = await login(selectedUser, 'password');
    if (!success) {
      setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Factory className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Manufacturing QC</h1>
          <p className="text-gray-600 mt-2">เข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ด</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-2">
              เลือกผู้ใช้ (ทดลอง)
            </label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              required
            >
              <option value="">เลือกผู้ใช้...</option>
              {demoUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !selectedUser}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
};