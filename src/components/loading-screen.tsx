export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <div className="w-8 h-8 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-center text-gray-600">กำลังโหลด...</p>
      </div>
    </div>
  );
}
