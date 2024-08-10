import { UniqueIdentifier } from "@dnd-kit/core"

export interface PropsDrop {
  children?: React.ReactNode
  id: string
}

export interface PropsDrag {
  children?: React.ReactNode
  id: string
  text: string
  handleDeleteButton: (event: React.MouseEvent<HTMLButtonElement>, dragItemId: string) => void
  handleEditButton: (newText: string, dragItemId: string) => void
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