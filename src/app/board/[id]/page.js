"use client";
import Button from "@/components/button";
import BoardColumn from "@/components/board-column";
import { useEffect, useState } from "react";
import { serverUrl } from "@/global-variables";
import { callApi } from "@/components/call-api";
import { useParams, useRouter } from "next/navigation"; // 1. Added useRouter
import { loggedUserId } from "@/global-variables";
import RedButton from "@/components/red-button";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

export default function SelectedBoard() {
  const { id } = useParams(); // board id
  const router = useRouter(); // 2. Initialize the router
  const [columns, setColumns] = useState([]);
  const [boardName, setBoardName] = useState(""); 
  const [isEditingName, setIsEditingName] = useState(false);
  const [authenticate,setAuthenticate] = useState(false);
  const [permissionType,setPermissionType] = useState("write");

const onDragEnd = async (result) => {
  const { destination, source, draggableId } = result;

  // Si no hay destino (se soltó fuera) o es el mismo lugar, ignorar
  if (!destination) return;
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) return;

  // AQUÍ: 1. Actualiza tu estado local 'columns' para que se vea el cambio al instante
  // AQUÍ: 2. Haz el fetch a tu API para guardar el cambio en la DB
  console.log(`Moviendo tarea ${draggableId} a columna ${destination.droppableId}`);
};


  // Fixed navigateTo to use the initialized router
  const navigateTo = (path) => router.push("/" + path);

  const fetchBoardPermission = async () => {
    try {
      const response = await fetch(`${serverUrl}/get-permission-board/${id}/${loggedUserId.value}`);
      const data = await response.json();
      const permission = Array.isArray(data) ? data[0] : data;
      if(permission?.type=="read") setPermissionType("read");
      if(permission?.type=="write") setPermissionType("write");
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const fetchBoard = async () => {
    try {
      const response = await fetch(`${serverUrl}/boards/${id}`);
      const data = await response.json();
      const board = Array.isArray(data) ? data[0] : data;
      setBoardName(board?.name || "[nombre de tablero no encontrado]");
    } catch (error) {
      console.error("Error fetching board name:", error);
    }
  };

  const fetchColumns = async () => {
    try {
      const response = await fetch(`${serverUrl}/boards/${id}/columns`);
      const data = await response.json();
      setColumns(data);
    } catch (error) {
      console.error("Couldn't fetch columns: ", error);
    }
  };

  const deleteBoard = async () => {
    if (permissionType !== "write") {
      alert("No tienes permisos para eliminar este tablero.");
      return;
    }

    if (!confirm("¿Estás seguro de que quieres eliminar este tablero?")) return;
    
    try {
      const res = await callApi(`${serverUrl}/delete-board/${id}`, "DELETE");
      
      // Changed to boards to match your dashboard route
      console.log("Tablero eliminado con éxito");
      navigateTo("boards"); 
    } catch (error) {
      console.error("Error eliminando tablero:", error);
      alert("Hubo un error al intentar eliminar el tablero.");
    }
  };

 const createColumn = async () => {
    if(permissionType !== "write"){
      window.alert("Solo tiene permisos de lectura");
      return;
    }

    try {
      // 1. Perform the creation
      const res = await callApi(`${serverUrl}/create-column`, "POST", { id });
      
      // 2. Check if the response actually contains the new column data
      // Most backends return the created object. If yours does, use it!
      
       if (res.status === 201) {
      fetchColumns();
      }
    } catch (error) {
      console.error("Error creating column:", error);
    }
  };

  const updateBoardName = async () => {
     if(permissionType!="write"){
      window.alert("Solo tiene permisos de lectura");
      return;
    }
    try {
      await callApi(`${serverUrl}/boards/${id}/update-name`, "PUT", {
        name: boardName,
      });
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating board name:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBoardPermission();
    fetchBoard();
    fetchColumns(); // Fetch columns here initially
  }, [columns]);

  // 3. Removed the infinite loop effect. 
  // We now call fetchColumns() only when an action (like createColumn) happens.

  return (
    <DragDropContext onDragEnd={onDragEnd}>
    <div className="bg-[url('/bgboard.png')] bg-no-repeat bg-fixed bg-cover bg-center font-sans grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="w-max flex-1">
        <div className="project-container">
          <div className="flex items-center gap-3 mb-10">
            {isEditingName ? (
              <>
                <RedButton onClick={deleteBoard}>Eliminar</RedButton>
                <input
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="text-5xl font-bold border-b border-gray-400 outline-none bg-transparent"
                />
                <Button onClick={updateBoardName}>Guardar</Button>
              </>
            ) : (
              <h1
                className="text-5xl font-bold cursor-pointer"
                onClick={() => setIsEditingName(true)}
              >
                {boardName}
              </h1>
            )}
          </div>

          <div className="flex gap-14">
            {columns.map((column, index) => (
              <div key={index} className="mb-10">
                <h2 className="flex gap-4 flex-wrap items-center mb-4"></h2>
                <div className="flex-none">
                  <BoardColumn linked_column_id={column.column_id} permission_type={permissionType} />
                </div>
              </div>
            ))}
                  {/* BOTÓN MEJORADO: Añadir Columna */}
              {permissionType === "write" && (
                <button
                  onClick={createColumn}
                  className="mt-4 flex-none w-55 h-30 flex items-center justify-center gap-2 
                             bg-white/10 hover:bg-white/20 backdrop-blur-sm 
                             border-2 border-dashed border-white/30 hover:border-white/50 
                             rounded-xl text-white font-medium transition-all duration-200 cursor-pointer"
                >
                  <span className="text-2xl">+</span>
                  <span>Añadir columna</span>
                </button>
              )}
          
          </div>
        </div>
      </main>
    </div>
    </DragDropContext>
  );
}