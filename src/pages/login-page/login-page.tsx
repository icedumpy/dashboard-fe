import { Factory } from 'lucide-react';
import React from 'react';

import LoginCard from './login-form';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-hero-br">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-full">
            <Factory className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Manufacturing QC</h1>
          <p className="mt-2 text-gray-600">เข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ด</p>
        </div>
        <LoginCard />
      </div>
    </div>
  );
};
