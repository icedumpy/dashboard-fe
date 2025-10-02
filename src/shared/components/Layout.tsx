import React from "react";
import { Factory, LogOut, User, Bell } from "lucide-react";

import { useAuth } from "@/shared/hooks/auth/use-auth";
import { ROLES } from "@/shared/constants/auth";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case ROLES.OPERATOR:
        return "bg-green-100 text-green-800";
      case ROLES.INSPECTOR:
        return "bg-blue-100 text-blue-800";
      case ROLES.SUPERADMIN:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Factory className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-500"></p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.display_name}
                  </p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                      user?.role || ""
                    )}`}
                  >
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <button
                  onClick={() => logout()}
                  className="p-2 text-gray-400 transition-colors hover:text-gray-600"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
