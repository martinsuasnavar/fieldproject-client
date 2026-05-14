export default function GreenButton({children, onClick}) {
  return (
    <a onClick={onClick} className="w-30 h-8 rounded bg-green-500 flex items-center justify-center cursor-pointer text-white select-none">
      {children}
    </a>
  );
}
