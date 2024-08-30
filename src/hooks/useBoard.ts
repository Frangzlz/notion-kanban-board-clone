import { useEffect, useState } from "react";
import { DragItem, useBoardProps } from "../types";
import { DragEndEvent } from "@dnd-kit/core";
import { v4 as uuidv4 } from 'uuid';

export function useBoard ({ draggableItems, droppableBoxes }: useBoardProps) {
  const tasksFromLocalStorage = localStorage.getItem('__tasksState__')
  const [dragItems, setDragItems] = useState(tasksFromLocalStorage ? JSON.parse(tasksFromLocalStorage) : draggableItems)

  const [inputText, setInputText] = useState('')
  const [showInput, setShowInput] = useState<{ [key: string]: boolean }>({})

  const [isOverDroppable, setIsOverDroppable] = useState<{ [key: string]: boolean }>({})

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
        if (activeIndex === 0) {
          newDragItemsState.splice(overIndex - 1, 0, deletedActiveItem)
        } else {
          newDragItemsState.splice((overIndex + 1) - 1, 0, deletedActiveItem)
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
    setInputText('')
    setShowInput((prevState) => (
      {
        ...prevState,
        [dropBoxId]: false
      }
    ))
    addNewTask(dropBoxId)
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

  return {
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
  }
}
