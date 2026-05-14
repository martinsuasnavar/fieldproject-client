"use client";
import { useState, useEffect } from "react";
import { serverUrl, loggedUserId } from "@/global-variables";
import BoardAccess from "./board-access";
import { useRouter } from "next/navigation";

export default function BoardList({linked_project_id}) {
  const [boards,setBoards]=useState([]);
  const router = useRouter();

   const fetchBoards = async () => {
   try {
      //console.log(`Fetching boards from project with id ${linked_project_id}...`);
      const response = await fetch(`${serverUrl}/projects/${linked_project_id}/boards`);
      const data = await response.json();
      setBoards(data);
    } catch (error) {
      console.error(`Couldn't fetch boards: `, error);
    }
  };

  useEffect(() => {
    fetchBoards();//es posible que haya errores, revisar después
  }, [boards]);
 
  const navigateToBoard = (anId) => {
    console.log(anId);
    const boardId = anId;
    router.push("/board/" + boardId);
  }

    return (
    <div className="flex gap-2">
        {boards.map((board, index) => (
        <BoardAccess key={board.board_id} board_name={board.name}  onClick={() => navigateToBoard(board.board_id)}/>
        ))}
    </div>
    );
}