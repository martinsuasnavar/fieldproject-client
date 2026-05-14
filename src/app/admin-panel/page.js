"use client";
import { useEffect, useState } from "react";
import { serverUrl } from "@/global-variables";
import { loggedUserId } from "@/global-variables";
import { useRouter } from "next/navigation"; // 1. Added useRouter
import { fallbackModeToFallbackField } from "next/dist/lib/fallback";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, isAdmin] = useState(false);

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      // Note: verify if it should be /users or /userss
      const response = await fetch(`${serverUrl}/users`); 
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Couldn't fetch users: ", error);
    } finally {
      setLoading(false);
    }
  };

    const getAdmin = async () => {
    try {
      // Note: verify if it should be /users or /userss
      const response = await fetch(`${serverUrl}/check-admin/${loggedUserId.value}`); 
      const data = await response.json();
      setUsers(data);
      if(response.status==200){
        isAdmin(true);
      }else{
        isAdmin(false);
      }
    } catch (error) {
      console.error("Couldn't fetch users: ", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getAdmin();
    fetchUsers();
  }, []); // ✅ Empty array means "run once on load"

  return (
    <div>
 {!admin ? (
  <div>
    Access denied
  </div>
  ) : (
  <div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-5xl mb-10 font-bold">Portal administrador</h1>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <div className="flex flex-col gap-4"> 
            {users.length > 0 ? (
              users.map((user, index) => (
                <div key={index} 
                  className={`flex items-center justify-between p-4 rounded-lg text-white transition-colors ${user.deactivate ? "bg-red-900/50 border border-red-500" : "bg-gray-800"}`}
                >
                  <span className="font-medium">{user.username}</span>
                  <div className="relative inline-block group">
                    <a className="cursor-pointer text-blue-400 hover:text-blue-200 transition-colors" onClick={()=>router.push(`/admin-panel/user-manage/${user.id}`)}>
                      Administrar
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p>No se encontraron usuarios.</p>
            )}
          </div>
        )}
      </main>
    </div>
   )}
   </div>
  );
  
}