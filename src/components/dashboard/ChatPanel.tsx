import React, { FC } from "react"

type Props = {
  selectedRoom: string | undefined
}

const ChatPanel: FC<Props> = ({ selectedRoom }) => {
  if (!selectedRoom) return <></>
  return (
    <div>
      <div>ChatPanel {selectedRoom}</div>
    </div>
  )
}

export default ChatPanel
