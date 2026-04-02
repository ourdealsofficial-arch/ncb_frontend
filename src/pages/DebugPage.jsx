import React, { useState, useEffect } from "react";

const DebugPage = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser({ error: "Failed to parse user data" });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-3">Token</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {token || "No token found"}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">User Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {user ? JSON.stringify(user, null, 2) : "No user data found"}
          </pre>
          
          {user && (
            <div className="mt-4">
              <p className="text-lg"><strong>Role:</strong> {user.role || "Not found"}</p>
              <p className="text-lg"><strong>Email:</strong> {user.email || "Not found"}</p>
              <p className="text-lg"><strong>Name:</strong> {user.name || "Not found"}</p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-yellow-700">
            <li>Login karo</li>
            <li>Is page pe aao: /debug</li>
            <li>Check karo ki user data me role field hai ya nahi</li>
            <li>Console me bhi logs check karo (F12 press karo)</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
