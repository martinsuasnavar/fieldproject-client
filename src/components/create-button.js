export default function CreateButton({onClick}) {
    const animationClasses =
    "transition-transform duration-300 ease-out hover:scale-105 hover:shadow-lg";

  return (
    <a onClick={onClick} className={` h-8 rounded bg-green-500 flex items-center justify-center aspect-square rounded-full cursor-pointer select-none text-black ${animationClasses}`}>
      +
    </a>
  );
}
