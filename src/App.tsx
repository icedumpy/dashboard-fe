import { Routes, Route } from "react-router-dom";

import LoginPage from "@/pages/login-page";
import OperatorPage from "@/pages/operator-page";
import ProtectedRoute from "@/components/protected-route";
import AuthGuard from "@/components/auth-guard";
import QCPage from "@/pages/qc-page";

import { useAuth } from "./hooks/auth/use-auth";
import { ROLES } from "./contants/auth";

import type { RoleType } from "./types/auth";

function App() {
  const { user } = useAuth();

  const getDashboard = (role?: RoleType) => {
    switch (role) {
      case ROLES.OPERATOR:
      case ROLES.VIEWER:
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
