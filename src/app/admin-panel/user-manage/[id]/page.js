"use client";
import { useEffect, useState } from "react";
import { serverUrl, loggedUserId } from "@/global-variables";
import { useParams, useRouter } from "next/navigation";
import RedButton from "@/components/red-button";
import GreenButton from "@/components/green-button";

export default function UserManager() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admin, setIsAdmin] = useState(false);
  
  // ESTADO PARA EL TOGGLE
  const [showDetails, setShowDetails] = useState(false);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch(`${serverUrl}/check-admin/${loggedUserId.value}`);
      setIsAdmin(response.ok);
    } catch (error) { console.error(error); }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`${serverUrl}/get-user/${id}`);
      const data = await response.json();
      setUserData(Array.isArray(data) ? data[0] : data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleToggleActivation = async () => {
    const isDeactivated = userData?.deactivate;
    const endpoint = isDeactivated ? "activate-user" : "deactivate-user";
    if (!confirm(`¿Seguro que quieres cambiar el estado?`)) return;

    try {
      const response = await fetch(`${serverUrl}/${endpoint}/${id}`, { method: "PUT" });
      if (response.ok) fetchUser();
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    checkAdminStatus();
    fetchUser();
  }, [id]);

  if (!loading && !admin) return <div className="p-20 text-center">Access denied</div>;

  return (
    <div className="font-sans min-h-screen p-8 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-5xl mb-10 font-bold">Gestión de Usuario</h1>

        {loading ? (
          <p>Cargando...</p>
        ) : userData ? (
          <div className="flex flex-col gap-4">
            {/* CARD PRINCIPAL */}
            <div className={`flex flex-col p-6 rounded-lg text-white transition-all ${
              userData.deactivate ? 'bg-red-900/20 border border-red-500' : 'bg-gray-800'
            }`}>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium text-xl">{userData.username}</span>
                  <span className="text-gray-400 text-sm">{userData.email}</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* BOTÓN TOGGLE */}
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="cursor-pointer text-blue-400 hover:underline text-sm"
                  >
                    {showDetails ? "Ocultar detalles" : "Ver detalles"}
                  </button>

                  {userData.deactivate ? (
                    <GreenButton onClick={handleToggleActivation} >
                      Activar
                    </GreenButton>
                  ) : (
                    <RedButton onClick={handleToggleActivation}>Desactivar</RedButton>
                  )}
                </div>
              </div>

              {/* SECCIÓN DE DETALLES (CONDICIONAL) */}
              {showDetails && (
                <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-2 gap-4 text-sm animate-in fade-in duration-300">
                  <div>
                    <p className="text-gray-400">ID de Usuario:</p>
                    <p>{userData.id || userData._id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Rol:</p>
                    <p>{userData.role || "Usuario estándar"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Fecha de registro:</p>
                    <p>{userData.createdAt || "No disponible"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Última conexión:</p>
                    <p>{userData.lastLogin || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Usuario no encontrado.</p>
        )}
      </main>
    </div>
  );
}