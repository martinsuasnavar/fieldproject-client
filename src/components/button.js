export default function Button({children, onClick}) {
  return (
    <a onClick={onClick} className="w-30 h-8 rounded bg-blue-500 flex items-center justify-center cursor-pointer text-white select-none">
      {children}
    </a>
  );
}
