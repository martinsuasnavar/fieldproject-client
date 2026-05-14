"use client";
import { useState, useEffect } from "react";
import { serverUrl } from "@/global-variables";
import { callApi } from "./call-api";
import CreateButton from "./create-button";
import TaskCard from "./task-card";

export default function BoardColumn({ linked_column_id, permission_type }) {
  const [tasks, setTasks] = useState([]);
  const [columnName, setColumnName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  const fetchColumn = async () => {
    try {
      const response = await fetch(`${serverUrl}/columns/${linked_column_id}`);
      const data = await response.json();
      const column = Array.isArray(data) ? data[0] : data;
      setColumnName(column?.name || "[nombre de columna no encontrado]");
    } catch (error) {
      console.error("Error fetching column name:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${serverUrl}/columns/${linked_column_id}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Couldn't fetch tasks:", error);
    }
  };

  const createTask = async () => {
    if(permission_type!="write"){
      window.alert("Solo tiene permisos de lectura");
      return;
    }
    try {
      await callApi(`${serverUrl}/create-task`, "POST", {
        linked_column_id,
      });
      console.log("Tarea creada");
      fetchTasks();
    } catch (error) {
      console.error("Error creando tarea:", error);
    }
  };

  const updateColumnName = async () => {
    if(permission_type!="write"){
      window.alert("Solo tiene permisos de lectura");
      return;
    }
    if(columnName==""){
      window.alert("Nombre de columna vacío");
      return;
    }
    try {
      await callApi(`${serverUrl}/columns/${linked_column_id}/update-name`, "PUT", {
        name: columnName,
      });
      console.log("Nombre de columna actualizado");
      setIsEditingName(false);
    } catch (error) {
      console.error("Error actualizando nombre de columna:", error);
    }
  };

  const deleteColumn = async () => {
     if(permission_type!="write"){
      window.alert("Solo tiene permisos de lectura");
      return;
    }
    const confirmDelete = confirm(`ATENCIÓN: Esta por eliminar la columna "${columnName}"`);
    if (!confirmDelete) return;

    try {
      await callApi(`${serverUrl}/columns/${linked_column_id}`, "DELETE");
      console.log("Columna eliminada");
    } catch (error) {
      console.error("Error eliminando columna:", error);
    }
  };

  useEffect(() => {
    if(!isEditingName){
      fetchColumn();
      fetchTasks();
    }
  }, [tasks]);

  return (
    <div className="min-w-[200px] w-fit h-fit rounded bg-white/70 text-black flex flex-col items-center justify-start p-4 shadow-md bg-transparent backdrop-blur-md">
      {/* Encabezado de columna editable */}
      <div className="mb-4 w-full text-center">
        {isEditingName ? (
          <>
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              className="text-lg font-semibold border-b border-gray-400 outline-none bg-transparent text-center w-full"
            />
            <button
              onClick={updateColumnName}
              className="mt-1 text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Guardar
            </button>
          </>
        ) : (
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-semibold cursor-pointer"
              onClick={() => setIsEditingName(true)}
            >
              {columnName}
            </h2>
            {/* 🗑️ Botón para eliminar */}
            <button
              onClick={deleteColumn}
              className="text-red-500 hover:text-red-700 text-lg font-bold cursor-pointer"
              title="Eliminar columna"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Lista de tareas */}
      <div className="mb-4 w-full">
        {tasks.map((task) => (
          <TaskCard task_id={task.task_id} key={task.task_id} task_content={task.content} permission_type={permission_type}>{task.content}</TaskCard>
        ))}
      </div>

      {/* Botón para crear tarea */}
      <CreateButton onClick={createTask} />
    </div>
  );
}