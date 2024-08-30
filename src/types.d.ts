import { UniqueIdentifier } from "@dnd-kit/core"

export interface PropsDrop {
  children?: React.ReactNode
  id: string
  toggleIsOverDroppable: (id:string, isOver: boolean) => void
}

export interface PropsDrag {
  children?: React.ReactNode
  id: string
  text: string
  handleDeleteButton: (event: React.MouseEvent<HTMLButtonElement>, dragItemId: string) => void
  handleEditButton: (newText: string, dragItemId: string) => string | undefined
}

export interface DropBox {
  id: string
  color: string
  text: string
}

export interface DragItem {
  id: string
  text: string
  parentId?: string
}

export interface useBoardProps {
  draggableItems: DragItem[]
  droppableBoxes: DropBox[]
}