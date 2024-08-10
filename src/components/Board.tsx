import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Draggable } from "./Draggable.tsx";
import { Droppable } from "./Droppable.tsx";
import React, { useState } from "react";
import { DragItem, DropBox } from "../types";
import { PlusButtonIcon } from "./icons/Icons.tsx";
import "./Board.css"

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

  const [dragItems, setDragItems] = useState(draggableItems)
  const [inputText, setInputText] = useState('')
  const [showInput, setShowInput] = useState<{ [key: string]: boolean }>({})

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event

    if (!over) return

    if (over.id === active.id) return

    if (droppableBoxes.some(item => item.id === over.id)) {
      // const newDragItemsState = dragItems.map((item) => (
      //   item.id === active.id
      //     ? { ...item, parentId: over?.id.toString() }
      //     : item
      // ))
      // setDragItems(newDragItemsState)
      const activeIndex = dragItems.findIndex((item) => item.id === active.id)
      const auxDragItems = [...dragItems]
      const [deletedItem] = auxDragItems.splice(activeIndex, 1)
      auxDragItems.push(deletedItem)

      const newDragItemsState = auxDragItems.map((item) => (
        item.id === active.id
          ? { ...item, parentId: over.id.toString() }
          : item
      ))
      setDragItems(newDragItemsState)
    }

    const activeIndex = dragItems.findIndex((item) => item.id === active.id)
    const overIndex = dragItems.findIndex((item) => item.id === over.id)

    if (activeIndex !== -1 && overIndex !== -1) {
      const newDragItemsState = [...dragItems]
      const [deletedActiveItem] = newDragItemsState.splice(activeIndex, 1)
      newDragItemsState.splice(overIndex, 0, deletedActiveItem)

      if (dragItems[overIndex].parentId !== deletedActiveItem.parentId) {
        // const auxDragItemParentId = dragItems[overIndex].parentId
        // dragItems[overIndex].parentId = deletedActiveItem.parentId
        // deletedActiveItem.parentId = auxDragItemParentId
        deletedActiveItem.parentId = dragItems[overIndex].parentId
        // console.log(dragItems[overIndex])
        // console.log(deletedActiveItem)
        // console.log(newDragItemsState)
      }

      setDragItems(newDragItemsState)
    }
  }

  const handleButtonClick = (dropBoxId: string) => {
    setShowInput((prevState) => (
      {
        ...prevState,
        [dropBoxId]: true
      }
    ))
  }

  const addNewTask = (dropBoxId: string) => {
    const newTask: DragItem = {
      id: `drag-item-${dragItems.length + 1}`,
      text: inputText === '' ? 'Sin Titulo' : inputText,
      parentId: dropBoxId
    }
    setDragItems(prevState => [...prevState, newTask])

    setInputText('')
    setShowInput((prevState) => ({
      ...prevState,
      [dropBoxId]: false
    }))
  }

  const handleDeleteButton = (event: React.MouseEvent<HTMLButtonElement>, dragItemId: string) => {
    event.stopPropagation()
    if (event.button === 0) {
      const newDragItems = dragItems.filter((item) => item.id !== dragItemId)
      setDragItems(newDragItems)
    }
  }

  const handleEditButton = (newText: string, dragItemId: string) => {
    const editedTask = dragItems.map((item) => {
      if (item.id !== dragItemId) return item
      return { ...item, text: newText }
    })

    console.log(editedTask)

    setDragItems(editedTask)
  }

  const handleInputBlur = (dropBoxId: string) => {
    setShowInput((prevState) => (
      {
        ...prevState,
        [dropBoxId]: false
      }
    ))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, dropBoxId: string) => {
    if (event.key === 'Enter') {
      addNewTask(dropBoxId)
    }
  }

  return (
    <div className="board-container">
      <DndContext
        onDragEnd={handleDragEnd}
      >
        {
          droppableBoxes.map((dropBox) => (
            <div className="board-column" key={dropBox.id}>
              <header className="header-column-text">
                <span className={`label-container label__${dropBox.color}`}>
                  <div className={`dot dot__${dropBox.color}`}></div>
                  <span className="column-label">{dropBox.text}</span>
                </span>
                <div className="column-number-tasks">
                  {dragItems.filter((item) => item.parentId === dropBox.id).length}
                </div>
              </header>
              <Droppable id={dropBox.id}>
                {
                  dragItems
                    .filter((item) => item.parentId === dropBox.id)
                    .map((item) => (
                      <Draggable
                        key={item.id}
                        id={item.id}
                        text={item.text}
                        handleDeleteButton={handleDeleteButton}
                        handleEditButton={handleEditButton}
                      />
                  ))
                }
                {
                  showInput[dropBox.id] &&
                    <div className="container-input-task">
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
                <footer className="button-container" onClick={() => handleButtonClick(dropBox.id)}>
                  <PlusButtonIcon />
                  <button className="button-new-item">
                    New item
                  </button>
                </footer>
              </Droppable>
            </div>
          ))
        }
      </DndContext>
    </div>
  )
}
