import Image from "next/image";
import { TierItem } from "@/lib/types";

export default function ItemCard({
  item,
  onDragStart,
  onClick,
  isSelected = false,
}: {
  item: TierItem;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  return (
    <div
      className={`aspect-square w-full flex flex-col items-center ${
        isSelected ? "bg-primary/20 rounded-md" : ""
      } ${onClick ? "cursor-pointer" : ""}`}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <div className="w-12 h-12">
        <Image
          width={100}
          height={100}
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-xs mt-1 text-center">{item.name}</p>
    </div>
  );
}
