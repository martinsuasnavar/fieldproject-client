"use client";
import Button from "@/components/button";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/input";
import { useState } from "react";
import { callApi } from "@/components/call-api";
import { serverUrl } from "@/global-variables";

export default function AddMember() {
  const [userName, setUserName] = useState("");
  const [permission, setPermission] = useState("read");
  const [loading, setLoading] = useState(false); // Added loading state
  
  const router = useRouter();
  const { id } = useParams(); // board id

  const navigateBack = () => {
    router.push(`/members/${id}`);
  };

  const addMember = async (e) => {
    e.preventDefault();
    if (!userName.trim()) return alert("Por favor, ingrese un usuario");

    setLoading(true);
    console.log("Creando miembro...");

    try {
      const res = await callApi(`${serverUrl}/create-permission/${id}`, "POST", {
        userName,
        permission,
      });

      // Handle responses based on status codes
      if (res.status === 201) {
        alert("Permiso creado con éxito 🎉");
        navigateBack(); // Navigate ONLY after success
      } else if (res.status === 500) {
        alert("Error: Nombre de usuario no válido o error de servidor");
      } else {
        alert(res?.message || "Ocurrió un error inesperado");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen p-8 sm:p-20">
      <main className="max-w-xl mx-auto">
        <h1 className="text-5xl mb-10 font-bold text-white">Agregar miembro</h1>

        <div className="space-y-6 bg-gray-900 p-6 rounded-xl">
          {/* Nombre de usuario */}
          <div>
            <label className="block mb-2 font-medium">Nombre de usuario</label>
            <Input
              type="text"
              placeholder="Ej: juan_perez"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          {/* Permisos */}
          <div>
            <div className="mb-3 font-medium">Permiso</div>
            <div className="flex gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="permission"
                  value="read"
                  className="w-4 h-4"
                  checked={permission === "read"}
                  onChange={(e) => setPermission(e.target.value)}
                />
                Lectura
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="permission"
                  value="write"
                  className="w-4 h-4"
                  checked={permission === "write"}
                  onChange={(e) => setPermission(e.target.value)}
                />
                Escritura
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex pt-4 gap-4">
            <Button 
              onClick={addMember} 
              disabled={loading}
              className={loading ? "opacity-50" : ""}
            >
              {loading ? "Agregando..." : "Agregar"}
            </Button>
            <Button onClick={navigateBack} variant="secondary">
              Cerrar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}