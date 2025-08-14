import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { OperatorDashboard } from './components/OperatorDashboard';
import { QCDashboard } from './components/QCDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  switch (user.role) {
    case 'operator':
      return <OperatorDashboard />;
    case 'qc':
      return <QCDashboard />;
    case 'superadmin':
      // Super admin has access to all views - for now showing manager dashboard
      // TODO: Could implement a view switcher for super admin
      return <ManagerDashboard />;
    case 'viewer':
      return <OperatorDashboard />; // Viewer sees operator dashboard in read-only mode
    default:
      return <OperatorDashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;