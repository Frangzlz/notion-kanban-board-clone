import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Draggable } from "./Draggable.tsx";
import { Droppable } from "./Droppable.tsx";
import React, { useEffect, useState } from "react";
import { DragItem, DropBox } from "../types";
import { DocumentIcon, PlusButtonIcon } from "./icons/Icons.tsx";
import { v4 as uuidv4 } from 'uuid';
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

  const tasksFromLocalStorage = localStorage.getItem('__tasksState__')
  const [dragItems, setDragItems] = useState(tasksFromLocalStorage ? JSON.parse(tasksFromLocalStorage) : draggableItems)

  const [inputText, setInputText] = useState('')
  const [showInput, setShowInput] = useState<{ [key: string]: boolean }>({})

  const [isOverDroppable, setIsOverDroppable] = useState<{ [key: string]: boolean }>({})

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event

    if (!over) return
    if (over.id === active.id) return

    const activeIndex = dragItems.findIndex((item: DragItem) => item.id === active.id)
    const overIndex = dragItems.findIndex((item: DragItem) => item.id === over.id)

    if (droppableBoxes.some(item => item.id === over.id)) {
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

    if (activeIndex !== -1 && overIndex !== -1) {
      const newDragItemsState = [...dragItems]
      const [deletedActiveItem] = newDragItemsState.splice(activeIndex, 1)

      if (dragItems[overIndex].parentId !== deletedActiveItem.parentId) {
        if (overIndex === 0) {
          newDragItemsState.splice(overIndex, 0, deletedActiveItem)
        } else {
          newDragItemsState.splice(overIndex - 1, 0, deletedActiveItem)
        }
        deletedActiveItem.parentId = dragItems[overIndex].parentId
      } else {
        newDragItemsState.splice(overIndex, 0, deletedActiveItem)
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
    const textWithoutSpace = inputText.trim()

    if (!textWithoutSpace) {
      setInputText('')
      setShowInput((prevState) => ({
        ...prevState,
        [dropBoxId]: false
      }))
      return
    }

    const newTask: DragItem = {
      id: `drag-box-${uuidv4()}`,
      text: textWithoutSpace,
      parentId: dropBoxId
    }
    setDragItems((prevState: DragItem[]) => [...prevState, newTask])

    setInputText('')
    setShowInput((prevState) => ({
      ...prevState,
      [dropBoxId]: false
    }))
  }

  const handleDeleteButton = (event: React.MouseEvent<HTMLButtonElement>, dragItemId: string) => {
    event.stopPropagation()
    if (event.button === 0) {
      const newDragItems = dragItems.filter((item: DragItem) => item.id !== dragItemId)
      setDragItems(newDragItems)
    }
  }

  const handleEditButton = (newText: string, dragItemId: string) => {
    const newTextWithoutSpace = newText.trim()

    if (!newTextWithoutSpace) {
      return;
    }

    const editedTask = dragItems.map((item: DragItem) => {
      if (item.id !== dragItemId) return item
      return { ...item, text: newTextWithoutSpace }
    })

    setDragItems(editedTask)

    return newTextWithoutSpace
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

  const toggleIsOverDroppable = (id: string, isOver: boolean) => {
    setIsOverDroppable((prevState) => ({
      ...prevState,
      [id]: isOver
    }))
  }

  useEffect(() => {
    localStorage.setItem('__tasksState__', JSON.stringify(dragItems))
  }, [dragItems])

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
                <header className="header-column-text">
                  <span className={`label-container label__${dropBox.color}`}>
                    <div className={`dot dot__${dropBox.color}`}></div>
                    <span className="column-label">{dropBox.text}</span>
                  </span>
                  <div className="column-number-tasks">
                    {dragItems.filter((item: DragItem) => item.parentId === dropBox.id).length}
                  </div>
                </header>
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
        </div>
      </DndContext>
    </div>
  )
}
