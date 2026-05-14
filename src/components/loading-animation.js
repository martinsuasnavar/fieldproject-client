import Image from "next/image";

export default function LoadingAnimation({height, width}) {
  
  return (
    <Image alt="Loading animation" src="/loading.webp" height={height} width={width}/>
  );
}