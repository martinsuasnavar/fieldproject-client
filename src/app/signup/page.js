"use client";
import { useState } from "react";
import Button from "@/components/button";
import Input from "@/components/input";
import { serverUrl } from "../../global-variables";
import { callApi } from "@/components/call-api";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();

const createAccount = async (e) => {
  e.preventDefault();
  setError("");
  
  if (!email || !username || !password) {
    setError("Por favor, completa todos los campos.");
    return; // Button won't get stuck here because loading hasn't started
  }

  setLoading(true); // 1. Start loading

  try {
    const res = await callApi(`${serverUrl}/create-user`, "POST", {
      email,
      username,
      password,
    });

    if (res.status === 201 || !res?.message) {
      alert("Cuenta creada con éxito 🎉");
      router.push("/login");
      // Note: We don't strictly need setLoading(false) here 
      // because we are navigating away.
    } else {
      setError(res.message || "Error al crear la cuenta.");
      setLoading(false); // 2. Stop loading on functional error
    }
  } catch (err) {
    console.error(err);
    setError("Error de conexión con el servidor.");
    setLoading(false); // 3. Stop loading on network crash
  } 
  // OR use finally:
  // finally { setLoading(false); }
};

  return (
    <div className="font-sans min-h-screen flex items-center justify-center bg-black text-white p-8">
      <main className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-2xl shadow-2xl p-10 border border-zinc-800">
          <h1 className="text-3xl text-center font-bold mb-2">
            Crear cuenta
          </h1>
          <p className="text-zinc-400 text-center mb-8 text-sm">
            Ingrese sus datos
          </p>

          <form onSubmit={createAccount} className="space-y-5 text-black">
            {/* Error Message Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-zinc-500">
                Correo Electrónico
              </label>
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                className="bg-black border-zinc-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-zinc-500">
                Nombre de Usuario
              </label>
              <Input
                type="text"
                placeholder="usuario123"
                className="bg-black border-zinc-700 text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-zinc-500">
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-black border-zinc-700 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-6">
              <Button 
                onClick={createAccount}
                className="w-full py-3 bg-white text-black hover:bg-zinc-200 transition-all font-bold rounded-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Creando..." : "Registrarme"}
              </Button>
            </div>

            <div className="text-center pt-2">
              <a
                href="/login"
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                ¿Ya tienes cuenta? <span className="text-blue-400 font-medium">Inicia sesión</span>
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}