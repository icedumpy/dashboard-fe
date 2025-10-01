import { Routes, Route } from "react-router-dom";

import LoginPage from "@/pages/login-page";
import OperatorPage from "@/pages/operator-page";
import ProtectedRoute from "@/components/protected-route";
import AuthGuard from "@/components/auth-guard";
import QCPage from "@/pages/qc-page";
import ViewerPage from "./pages/viewer-page";

import { useAuth } from "./hooks/auth/use-auth";
import { ROLES } from "./constants/auth";

import type { Role } from "./types/auth";

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
