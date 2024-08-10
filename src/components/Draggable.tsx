import { useDraggable, useDroppable } from "@dnd-kit/core";
import { PropsDrag } from "../types";
import { useState } from "react";
import { DeleteButtonIcon, DocumentIcon, EditButtonIcon } from "./icons/Icons";
import './Draggable.css'

export function Draggable ({ id, text, handleDeleteButton, handleEditButton }: PropsDrag) {
  const [inputText, setInputText] = useState(text)
  const [editMode, setEditMode] = useState(false)

  const [isMouseOver, setIsMouseOver] = useState(false)

  const { isOver, setNodeRef: setNodeRefDroppable } = useDroppable({ id: id })
  const { isDragging, listeners, attributes, setNodeRef: setNodeRefDraggable, transform } = useDraggable({ id: id, disabled: editMode })

  const toggleEditMode = () => {
    setEditMode(true)
  }

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEditButton(inputText, id)
      setEditMode(false)
    }
  }

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRefDraggable}
      style={style}
      {...listeners}
      {...attributes}
      className="draggable-box"
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      <div ref={setNodeRefDroppable} className={`draggable-dropbox ${isOver && !isDragging ? 'isOverDraggable' : ''}`}>
        <div className={`${editMode ? 'container-input-edit' : ''}`}>
          {
            editMode
              ?
                <>
                  <DocumentIcon />
                  <input
                    id={`input-edit-${id}`}
                    className="input-edit"
                    type="text"
                    value={inputText}
                    autoFocus
                    onChange={(e) => handleEditChange(e)}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                </>
              : text
          }
        </div>
        {
          isMouseOver && !editMode &&
            <div className="container-button-drag">
              <button onMouseUp={() => toggleEditMode()} className="button-edit">
                <EditButtonIcon />
              </button>
              <button onPointerDown={(e) => handleDeleteButton(e, id)} className="button-delete">
                <DeleteButtonIcon />
              </button>
            </div>
        }
      </div>
    </div>
  )
}

// Arreglar auto focus