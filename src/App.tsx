import { Routes, Route } from "react-router-dom";

import LoginPage from "@/pages/login-page";
import OperatorPage from "@/pages/operator-page";
import ProtectedRoute from "@/components/protected-route";
import AuthGuard from "@/components/auth-guard";
import QCPage from "@/pages/qc-page";
import { ManagerDashboard } from "./components/ManagerDashboard";
import { OperatorDashboard } from "./components/OperatorDashboard";

import { useAuth } from "./hooks/auth/use-auth-v2";
import { ROLES } from "./contants/auth";

import type { RoleType } from "./types/auth";

function App() {
  const { user } = useAuth();

  const getDashboard = (role?: RoleType) => {
    switch (role) {
      case ROLES.OPERATOR:
      case ROLES.VIEWER:
        return <OperatorPage />; //V2
      case ROLES.QC:
      case ROLES.INSPECTOR:
        return <QCPage />; // V2
      case ROLES.SUPERADMIN:
        return <ManagerDashboard />; // V1
      default:
        return <OperatorDashboard />; // V1
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
