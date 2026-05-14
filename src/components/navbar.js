"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loggedUserName, loggedUserId, loggedIn } from "@/global-variables";
import { useState, useEffect } from "react"; // ✅ Añadimos hooks
import { serverUrl } from "@/global-variables";
import Image from "next/image";
import Cookies from "js-cookie";
import LoadingAnimation from "./loading-animation";

export default function Navbar() {
  const router = useRouter();
  const [admin, isAdmin] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const getAdmin = async () => {
    try {
      const response = await fetch(`${serverUrl}/check-admin/${loggedUserId.value}`); 
      if(response.status==200){
        isAdmin(true);
      }else{
        isAdmin(false);
      }
    } catch (error) {
      console.error("Couldn't fetch users: ", error);
    } finally {
    }
  };

  const logOut = () => {
    Cookies.remove("session_key");
    loggedIn.value = false;
    loggedUserId.value = 0;
    setIsAuth(false); // Actualizamos estado local
    router.push("/login");
  };

  if(loggedUserName.value!=null){
       loggedIn.value = true;
  }


  console.log(loggedUserId.value + "changed!!!!!!!!!!")
  // Sincronizamos el estado local con la variable global
  useEffect(() => {
    // Esto asegura que la Navbar se oculte/muestre si el valor cambia
    getAdmin();
    setIsAuth(loggedIn.value);
  }, [loggedUserId.value]);

  // 🔴 GUARD CLAUSE: Si no está logueado, no renderiza nada
  if (!isAuth) return <div></div>;

  return (
    <nav className="top-0 left-0 w-full flex items-center justify-between p-6 bg-gray-900/95 backdrop-blur-sm text-white shadow-lg z-[100] border-b border-gray-800">
      <div 
        className="text-2xl font-bold cursor-pointer hover:text-blue-400 transition-colors"
        onClick={() => router.push("/")}
      >
        <Image alt="icono home" src="/home-icon.webp" width="20" height="20" /> 
      </div>
      
      <div className="flex gap-6 items-center">
       
        <div className="relative group">
          <button 
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 cursor-pointer text-sm"
          >
            <Image alt="icono de usuario" src="/user-icon.webp" width="20" height="20" /> 
            {loggedUserName.value || <LoadingAnimation height="15" width="15" />}
          </button>

          <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
            <div className="py-2 text-sm">
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-700 transition-colors">
                Mi Perfil
              </Link>
              {admin && <Link href="/admin-panel" className="block px-4 py-2 hover:bg-gray-700 transition-colors text-blue-400">
                Portal Administrador
              </Link>}
              <hr className="border-gray-700 my-1" />
              <button
                onClick={logOut}
                className="w-full text-left px-4 py-2 hover:bg-red-900/40 text-red-400 transition-colors font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}