import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Draggable } from "./Draggable.tsx";
import { Droppable } from "./Droppable.tsx";
import { DragItem, DropBox } from "../types";
import { DocumentIcon } from "./icons/Icons.tsx";
import { useBoard } from "../hooks/useBoard.ts"
import "./Board.css"
import { DroppableFooter } from "./DroppableFooter.tsx";
import { DroppableHeader } from "./DroppableHeader.tsx";

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
      text: 'Task 1',
      parentId: 'drop-box-1'
    },
    {
      id: 'drag-box-2',
      text: 'Task 2',
      parentId: 'drop-box-1'
    },
    {
      id: 'drag-box-3',
      text: 'Task 3',
      parentId: 'drop-box-3'
    }
  ]

  const {
    dragItems,
    inputText,
    showInput,
    isOverDroppable,
    setInputText,
    handleDragEnd,
    handleButtonClick,
    handleDeleteButton,
    handleEditButton,
    handleInputBlur,
    handleKeyDown,
    toggleIsOverDroppable
  } = useBoard({ draggableItems, droppableBoxes })

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  )

  return (
    <div className="board-container">
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="board-content">
          {
            droppableBoxes.map((dropBox) => (
              <div className="board-column" key={dropBox.id}>
                <DroppableHeader
                  dropBox={dropBox}
                  dragItems={dragItems}
                />
                <Droppable
                  id={dropBox.id}
                  toggleIsOverDroppable={toggleIsOverDroppable}
                >
                  {
                    dragItems
                      .filter((item: DragItem) => item.parentId === dropBox.id)
                      .map((item: DragItem) => (
                        <Draggable
                          key={item.id}
                          id={item.id}
                          text={item.text}
                          handleDeleteButton={handleDeleteButton}
                          handleEditButton={handleEditButton}
                        />
                    ))
                  }
                  <div className={`line-is-over-droppable ${isOverDroppable[dropBox.id] ? 'is-over-drop' : ''}`}></div>
                  {
                    showInput[dropBox.id] &&
                      <div className="container-input-task">
                        <DocumentIcon />
                        <input
                          id="input-add-task"
                          className="input-add-task"
                          type="text"
                          autoFocus
                          value={inputText}
                          onBlur={() => handleInputBlur(dropBox.id)}
                          onKeyDown={(event) => handleKeyDown(event, dropBox.id)}
                          onChange={(event) => setInputText(event.target.value)}
                        />
                      </div>
                  }
                  <DroppableFooter
                    handleButtonClick={handleButtonClick}
                    dropBoxId={dropBox.id}
                  />
                </Droppable>
              </div>
            ))
          }
        </div>
      </DndContext>
    </div>
  )
}
