import { Dialog } from "@headlessui/react"
import { useState } from "react"
import Button, { Variant } from "../Button"

export const CreateRoomModal = ({ isOpen, onClose, onCreateRoom }: any) => {
  const [roomName, setRoomName] = useState<string>()

  const handleOnRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value)
  }

  const handleCreateRoom = () => {
    onCreateRoom(roomName)
    setRoomName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 ">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm gap-4 flex flex-col rounded bg-white p-8">
          <Dialog.Title>Create a new room</Dialog.Title>
          <input
            value={roomName}
            className="p-2"
            onChange={handleOnRoomNameChange}
            placeholder="Your Room Name"
            type="text"
          />

          <div className="flex gap-4">
            <Button variant={Variant.Primary} onClick={handleCreateRoom}>
              Create Room
            </Button>
            <Button variant={Variant.Secondary} onClick={onClose}>
              Cancel
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
