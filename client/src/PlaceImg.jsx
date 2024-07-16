import Image from "./Image.jsx";

export default function PlaceImg({event,index=0,className=null}) {
  if (!event.photos?.length) {
    return '';
  }
  if (!className) {
    className = 'object-cover';
  }
  return (
    <Image className={className} src={event.photos[index]} alt=""/>
  );
}