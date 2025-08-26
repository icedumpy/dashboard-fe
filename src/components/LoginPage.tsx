import React, { useState } from "react";
import { Factory, AlertCircle } from "lucide-react";

import { useAuth } from "@/hooks/auth/use-auth";

export const LoginPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState("");
  const { isLoading } = useAuth();

  const demoUsers = [
    { id: "operator@company.com", name: "P. Charuchinda", role: "Operator" },
    { id: "qc@company.com", name: "P. Charuchinda", role: "QC Inspector" },
    {
      id: "superadmin@company.com",
      name: "P. Charuchinda",
      role: "Super Admin",
    },
    { id: "viewer@company.com", name: "P. Charuchinda", role: "Viewer" },
  ];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedUser) {
      setError("กรุณาเลือกผู้ใช้เพื่อดำเนินการต่อ");
      return;
    }

    // const success = await login(selectedUser, "password");
    // if (!success) {
    //   setError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    // }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-full">
            <Factory className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Manufacturing QC</h1>
          <p className="mt-2 text-gray-600">เข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ด</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="user"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              เลือกผู้ใช้ (ทดลอง)
            </label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-3 transition-colors bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">เลือกผู้ใช้...</option>
              {demoUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-red-700 border border-red-200 rounded-lg bg-red-50">
              <AlertCircle className="flex-shrink-0 w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedUser}
            className="w-full px-4 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
};
