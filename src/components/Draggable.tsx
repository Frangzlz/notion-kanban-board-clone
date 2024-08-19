import { useDraggable, useDroppable } from "@dnd-kit/core";
import { PropsDrag } from "../types";
import { useEffect, useRef, useState } from "react";
import { DeleteButtonIcon, DocumentIcon, EditButtonIcon } from "./icons/Icons";
import './Draggable.css'

export function Draggable ({ id, text, handleDeleteButton, handleEditButton }: PropsDrag) {
  const [inputText, setInputText] = useState<string>(text)
  const [editMode, setEditMode] = useState(false)

  const [isMouseOver, setIsMouseOver] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const { isOver, setNodeRef: setNodeRefDroppable } = useDroppable({ id: id })
  const { active, isDragging, listeners, attributes, setNodeRef: setNodeRefDraggable, transform } = useDraggable({ id: id, disabled: editMode })

  const toggleEditMode = () => {
    setEditMode(true)
  }

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newText = handleEditButton(inputText, id)
      if (newText) {
        setInputText(newText)
      }
      setEditMode(false)
    }
  }

  const handleBlur = () => {
    setEditMode(false)
    setInputText(text)
  }

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  useEffect(() => {
    if (editMode && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 200)
    }
  }, [editMode])

  return (
    <> 
      <div className={`line-is-over ${isOver && !isDragging ? 'is-over-draggable' : ''}`}></div>
      <div
        ref={setNodeRefDraggable}
        style={style}
        {...listeners}
        {...attributes}
        className="draggable-box"
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <div ref={setNodeRefDroppable} className={`draggable-dropbox`}>
          <div className={`container-drag-text ${editMode ? 'container-input-edit' : ''}`}>
            {
              editMode
                ?
                  <>
                    <DocumentIcon />
                    <input
                      ref={inputRef}
                      id={`input-edit-${id}`}
                      className="input-edit"
                      type="text"
                      value={inputText}
                      onChange={(e) => handleEditChange(e)}
                      onKeyDown={(e) => handleKeyDown(e)}
                      onBlur={handleBlur}
                    />
                  </>
                : text
            }
          </div>
          <div className="container-button-edit-delete">
            {
              isMouseOver && !editMode && !active &&
                <div className="container-button-drag">
                  <button onPointerDown={() => toggleEditMode()} className="button-edit">
                    <EditButtonIcon />
                  </button>
                  <button onPointerDown={(e) => handleDeleteButton(e, id)} className="button-delete">
                    <DeleteButtonIcon />
                  </button>
                </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}
