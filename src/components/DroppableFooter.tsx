import { PlusButtonIcon } from "./icons/Icons";

interface PropsDroppableFooter {
  handleButtonClick: (dropboxId: string) => void
  dropBoxId: string
}

export function DroppableFooter ({ handleButtonClick, dropBoxId }: PropsDroppableFooter) {
  return (
    <footer className="button-container" onClick={() => handleButtonClick(dropBoxId)}>
      <PlusButtonIcon />
      <button className="button-new-item">
        New item
      </button>
    </footer>
  )
}
