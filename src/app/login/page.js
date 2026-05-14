"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useState } from "react";
import { loggedIn, serverUrl, userArray, loggedUserId, loggedUserName } from "../../global-variables";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false);

  const generateToken = () => {
    const rand = () => Math.random().toString(36).substr(2);
    return rand() + rand();
  };

  const generateSessionId = async (associatedUserId) => {
    const newSessionKey = generateToken();
    try {
      const response = await fetch(`${serverUrl}/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_key: newSessionKey,
          associated_user_id: associatedUserId,
        }),
      });

      if (response.ok) {
        Cookies.set("session_key", newSessionKey, { expires: 1 });
        loggedIn.value = true;
        loggedUserId.value = associatedUserId;
        
        const secondResponse = await fetch(`${serverUrl}/get-user/${loggedUserId.value}`); 
        const userDataBase = await secondResponse.json();
        const userData = Array.isArray(userDataBase) ? userDataBase[0] : userDataBase;
        console.log(userData);
        loggedIn.value = true;
        loggedUserName.value = userData.username;
      

        if(secondResponse.ok){
          router.push("/boards");
        }
      } else {
        setError("Error al crear la sesión.");
      }
    } catch (err) {
      setError("Error de conexión.");
    }
  };

  const logIn = async () => {
    setError("");
    setLoading(true);

    const selectedUser = userArray.find((u) => u.username === user);

    if (selectedUser) {
      if (password === selectedUser.password) {
        await generateSessionId(selectedUser.id);
      } else {
        setError("Contraseña incorrecta.");
        setLoading(false);
      }
    } else {
      setError("El usuario no existe.");
      setLoading(false);
    }
  };

  return (
    /* Main Container: Pure Black Background */
    <div className="font-sans min-h-screen flex items-center justify-center bg-black text-white">
      <main className="w-full max-w-md p-4">
        
        {/* Login Card: Dark Gray with a slight border */}
        <div className="bg-zinc-900 rounded-2xl shadow-2xl p-10 border border-zinc-800">
          <h1 className="text-3xl text-center font-bold mb-2">
            Bienvenido
          </h1>
          <p className="text-zinc-400 text-center mb-8 text-sm">
            
          </p>

          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-zinc-500">
                Usuario / Correo
              </label>
              <Input
                type="text"
                placeholder="nombre_usuario"
                className="bg-black border-zinc-700 text-white focus:border-blue-500" // Ensure your Input component accepts className
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-zinc-500">
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-black border-zinc-700 text-white focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <Button 
                onClick={logIn} 
                className="w-full py-3 bg-white text-black hover:bg-zinc-200 transition-all font-bold rounded-lg"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Entrar"}
              </Button>
            </div>

            <div className="text-center pt-2">
              <a
                href="/signup"
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                ¿No tienes cuenta? <span className="text-blue-400 font-medium">Regístrate</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}