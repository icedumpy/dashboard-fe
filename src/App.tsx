import React from "react";

import LoginPage from "./pages/login-page";
import LoadingScreen from "./components/loading-screen";
import OperatorPage from "./pages/operator-page";
import { OperatorDashboard } from "./components/OperatorDashboard";
import { QCDashboard } from "./components/QCDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { ManagerDashboard } from "./components/ManagerDashboard";

import { useAuth } from "@/hooks/auth/use-auth";
import { ROLES } from "./contants/auth";

import type { RoleType } from "./types/auth";

const getDashboard = (role: RoleType) => {
  switch (role) {
    case ROLES.OPERATOR:
    case ROLES.VIEWER:
      // return <OperatorDashboard />;
      return <OperatorPage />;
    case ROLES.QC:
    case ROLES.INSPECTOR:
      return <QCDashboard />;
    case ROLES.SUPERADMIN:
      return <ManagerDashboard />;
    default:
      return <OperatorDashboard />;
  }
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <LoginPage />;
  return getDashboard(user.role);
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
