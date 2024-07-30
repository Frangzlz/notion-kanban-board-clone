export interface PropsDragDrop {
  children?: React.ReactNode
  id: string
}

export interface DropBox {
  id: string
  color: string
  text: string
}

export interface DragItem {
  id: string
  text: string
  parentId: string
}