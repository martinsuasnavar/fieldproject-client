
export default function InputDescription({type, value, onChange}) {
    return (
      <textarea type={type} value={value} onChange={onChange} className="bg-gray-300 h-40 text-black font-bold text-left align-top-border"/>
    );
  }
  