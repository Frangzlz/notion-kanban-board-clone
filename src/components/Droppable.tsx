import { useDroppable } from "@dnd-kit/core";
import { PropsDragDrop } from "../types";

export function Droppable ({ children, id }: PropsDragDrop) {
  const { isOver, setNodeRef } = useDroppable({ id: id })
 
  return (
    <div ref={setNodeRef} className="droppable-box">
      {children}
    </div>
  )
}