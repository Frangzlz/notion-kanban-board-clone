import { useDroppable } from "@dnd-kit/core";
import { PropsDrop } from "../types";
import "./Droppable.css"

export function Droppable ({ children, id }: PropsDrop) {
  const { isOver, setNodeRef } = useDroppable({ id: id })
 
  return (
    <div ref={setNodeRef} className={`droppable-box ${isOver ? 'isOverStyle' : ''}`}>
      {children}
    </div>
  )
}