import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
// import { LoginPage } from './components/LoginPage';
import LoginPage from "./pages/login-page";
import { OperatorDashboard } from "./components/OperatorDashboard";
import { QCDashboard } from "./components/QCDashboard";
import { ManagerDashboard } from "./components/ManagerDashboard";
import { useAuth } from "@/hooks/auth/use-auth";

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="w-8 h-8 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-center text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  switch (user.role) {
    case "operator":
      return <OperatorDashboard />;
    case "qc":
      return <QCDashboard />;
    case "superadmin":
      // Super admin has access to all views - for now showing manager dashboard
      // TODO: Could implement a view switcher for super admin
      return <ManagerDashboard />;
    case "viewer":
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
