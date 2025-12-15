import { Route, Routes } from 'react-router-dom';

import LoginPage from '@/features/login';
import OperatorPage from '@/features/operator';
import QCPage from '@/features/qc';
import ViewerPage from '@/features/viewer';
import AuthGuard from '@/shared/components/auth-guard';
import ProtectedRoute from '@/shared/components/protected-route';

import { ROLES } from '@/shared/constants/auth';
import { useAuth } from '@/shared/hooks/auth/use-auth';

import type { Role } from '@/shared/types/auth';
import AdjustCamera from './features/operator/components/adjust-camera';

function App() {
  const { user } = useAuth();

  const getDashboard = (role?: Role) => {
    switch (role) {
      case ROLES.VIEWER:
        return <ViewerPage />;
      case ROLES.OPERATOR:
        return <OperatorPage />;
      case ROLES.INSPECTOR:
        return <QCPage />;
      case ROLES.SUPERADMIN:
        return <>TODO</>;
      default:
        return <>TODO</>;
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        index
        element={
          <ProtectedRoute>
            <AuthGuard>{getDashboard(user?.role)}</AuthGuard>
          </ProtectedRoute>
        }
      />
      <Route path="/camera/line/:lineId" element={<AdjustCamera />} />
    </Routes>
  );
}

export default App;
