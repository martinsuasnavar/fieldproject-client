"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { loggedUserId, loggedIn } from "@/global-variables";
import Cookies from "js-cookie";
import LoadingAnimation from "@/components/loading-animation";
import Navbar from "@/components/navbar"; // ✅ Importamos la nueva Navbar

export default function Home() {
  const router = useRouter();
  const backendDomain = "http://localhost:5000/api";
  const [loading, setLoading] = useState(true);

  const getLoggedUser = async () => {
    try {
      const response = await fetch(`${backendDomain}/sessions`);
      const data = await response.json();

      const sessionId = Cookies.get("session_key");
      if (!sessionId) {
        loggedIn.value = false;
        router.push("/login");
        return;
      }

      const userSession = data.find((s) => s.session_key === sessionId);

      if (userSession) {
        loggedIn.value = true;
        loggedUserId.value = userSession.associated_user_id;
        router.push("/boards");
      } else {
        loggedIn.value = false;
        router.push("/login");
      }
    } catch (error) {
      console.error("Error al obtener sesiones:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLoggedUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="p-20 flex justify-center text-center text-white">
          <LoadingAnimation height="40" width="40"/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-20 text-center text-white">
        
      </div>
    </div>
  );
}