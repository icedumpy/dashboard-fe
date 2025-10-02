import { Routes, Route } from "react-router-dom";

import LoginPage from "@/features/login";
import OperatorPage from "@/features/operator";
import ProtectedRoute from "@/shared/components/protected-route";
import AuthGuard from "@/shared/components/auth-guard";
import QCPage from "@/features/qc";
import ViewerPage from "@/features/viewer";

import { useAuth } from "@/shared/hooks/auth/use-auth";
import { ROLES } from "@/shared/constants/auth";

import type { Role } from "@/shared/types/auth";

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
      <Route
        index
        element={
          <ProtectedRoute>
            <AuthGuard>{getDashboard(user?.role)}</AuthGuard>
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
