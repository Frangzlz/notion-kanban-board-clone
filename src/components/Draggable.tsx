import { useDraggable } from "@dnd-kit/core";
import { PropsDragDrop } from "../types";

export function Draggable ({ children, id }: PropsDragDrop) {
  const { listeners, attributes, setNodeRef, transform } = useDraggable({ id: id })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="draggable-box">
      {children}
    </div>
  )
}