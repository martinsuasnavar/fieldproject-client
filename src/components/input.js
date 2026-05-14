
export default function Input({type, value, onChange}) {
    return (
      <input type={type} value={value} onChange={onChange} className="bg-gray-300 text-black font-bold"/>
    );
  }
  