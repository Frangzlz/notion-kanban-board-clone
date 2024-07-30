import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { Draggable } from "./Draggable.tsx";
import { Droppable } from "./Droppable.tsx";
import { useState } from "react";
import { DragItem, DropBox } from "../types";

export function Board () {
  const droppableBoxes: DropBox[] = [
    {
      id: 'drop-box-1',
      color: 'red',
      text: 'To do'
    }, 
    {
      id: 'drop-box-2',
      color: 'blue',
      text: 'In progress'
    }, 
    {
      id: 'drop-box-3',
      color: 'green',
      text: 'Done'
    }]
  
  const draggableItems: DragItem[] = [
    {
      id: 'drag-box-1',
      text: 'Hola',
      parentId: 'drop-box-1'
    },
    {
      id: 'drag-box-2',
      text: 'Hola 2',
      parentId: 'drop-box-1'
    },
    {
      id: 'drag-box-3',
      text: 'Hola 3',
      parentId: 'drop-box-3'
    }
  ]

  const [dragItems, setDragItems] = useState(draggableItems)

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event

    if (over) {
      const newDragItemsState = dragItems.map((item) => (
        item.id === active.id
          ? { ...item, parentId: over?.id.toString() }
          : item
      ))
      setDragItems(newDragItemsState)
    }
  }

  return (
    <div className="board-container">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        {
          droppableBoxes.map((dropBox) => (
            <div className="board-column" key={dropBox.id}>
              <header className="header-column-text">
                <span className={`label-container label__${dropBox.color}`}>
                  <div className={`dot dot__${dropBox.color}`}></div>
                  <span className="column-label">{dropBox.text}</span>
                </span>
              </header>
              <Droppable id={dropBox.id}>
                {
                  dragItems
                    .filter((item) => item.parentId === dropBox.id)
                    .map((item) => (
                      <Draggable key={item.id} id={item.id}>
                        {item.text}
                      </Draggable>
                  ))
                }
              </Droppable>
            </div>
          ))
        }
      </DndContext>
    </div>
  )
}
