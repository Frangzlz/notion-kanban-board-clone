import { useDroppable } from "@dnd-kit/core";
import { PropsDrop } from "../types";
import "./Droppable.css"
import { useEffect } from "react";

export function Droppable ({ children, id, toggleIsOverDroppable }: PropsDrop) {
  const { isOver, setNodeRef } = useDroppable({ id: id })

  useEffect(() => {
    toggleIsOverDroppable(id, isOver)
  }, [isOver])

 
  return (
    <div ref={setNodeRef} className="droppable-box">
      {children}
    </div>
  )
}