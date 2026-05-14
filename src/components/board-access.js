import Image from "next/image";

export default function BoardAccess({board_name, onClick}) {
  
  const animationClasses =
    "transition-transform duration-300 ease-out hover:scale-105 hover:shadow-lg";

  return (
    <div onClick={onClick}
      className={`w-40 h-20 rounded bg-white text-black flex items-center justify-center cursor-pointer ${animationClasses}`}
    >
      {board_name}
    </div>
  );
}