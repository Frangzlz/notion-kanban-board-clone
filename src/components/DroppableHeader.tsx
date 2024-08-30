import { DragItem, DropBox } from "../types"

interface PropsDroppableHeader {
  dropBox: DropBox
  dragItems: DragItem[]
}

export function DroppableHeader ({ dropBox, dragItems }: PropsDroppableHeader) {
  return (
    <header className="header-column-text">
      <span className={`label-container label__${dropBox.color}`}>
        <div className={`dot dot__${dropBox.color}`}></div>
        <span className="column-label">{dropBox.text}</span>
      </span>
      <div className="column-number-tasks">
        {dragItems.filter((item: DragItem) => item.parentId === dropBox.id).length}
      </div>
    </header>
  )
}