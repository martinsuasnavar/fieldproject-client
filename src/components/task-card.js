"use client";

import { useState, useEffect } from "react";
import { serverUrl } from "@/global-variables";
import { callApi } from "./call-api";
import Image from "next/image";
import LoadingAnimation from "./loading-animation";

export default function TaskCard({ task_id, permission_type }) {
  const [taskContent, setTaskContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener el contenido de la tarea al montar el componente
  useEffect(() => {
    
    const fetchTask = async () => {
      try {
        const data = await callApi(`${serverUrl}/tasks/${task_id}`, "GET");
       const task = Array.isArray(data) ? data[0] : data;
        setTaskContent(task?.content);
      } catch (error) {
        console.error("Error al obtener tarea:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [task_id]);



  const updateTaskContent = async () => {
    if(permission_type!="write"){
      window.alert("Solo tiene permisos de lectura");
      return;
    }
    console.log("actualziacndo")
    try {
      await callApi(`${serverUrl}/tasks/${task_id}/update-content`, "PUT", {
        content: taskContent,
      });
      console.log("Contenido de tarea actualizado");
      setIsEditing(false);
    } catch (error) {
      console.error("Error actualizando contenido de tarea:", error);
    }
  };

  const deleteTask = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;
    
    try {
      await callApi(`${serverUrl}/delete-task/${task_id}`, "DELETE");
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };



  if (loading) {
    return (
      <div className="w-60 h-10 mt-2 rounded  text-gray-500 flex items-center justify-center">
        <LoadingAnimation height="20" width="20"/>
      </div>
    );
  }

  return (
    <div className="w-60 h-fit mt-2 rounded bg-gray-300 text-black flex items-center justify-center p-2  cursor-pointer"
     onClick={() => setIsEditing(true)}>
      {isEditing ? (
        <div className="flex flex-col w-full">
          <input
            type="text"
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            className="w-full bg-transparent border-b border-gray-500 outline-none text-center"
          />
          <div className="flex justify-center">
           <button
              onClick={deleteTask}
              className="text-xs bg-red-500 p-2 text-white hover:underline mt-1 cursor-pointer mr-2"
            >
              Eliminar
            </button>
          <button
              onClick={updateTaskContent}
              className="text-xs bg-blue-500 p-2 text-white hover:underline mt-1 cursor-pointer mr-2"
            >
              Guardar
            </button>
           
          </div>
        </div>
      ) : (
        <p
          className="w-full text-center"
         
        >
          {taskContent}
        </p>
      )}
    </div>
  );
}