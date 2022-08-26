import { RtmChannel, RtmClient } from "agora-rtm-sdk"
import { useRouter } from "next/router"
import React, { FC, useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../../context/UserContext"
import { trpc } from "../../utils/trpc"
import Button, { Variant } from "../Button"
import UsersPanel from "./UsersPanel"

type Props = {
  selectedRoomId: string
  selectedRoomName: string
  refetchRooms: () => void
  client: RtmClient
  setSelectedRoomId: (roomId: string) => void
}

type Message = {
  text: string
  userId: string
  name: string
}

const ChatPanel: FC<Props> = ({
  refetchRooms,
  client,
  setSelectedRoomId,
  selectedRoomName,
  selectedRoomId,
}) => {
  const { user } = useContext(UserContext)
  const router = useRouter()
  const messagesRef = useRef<any>(null)
  const [text, setText] = useState<string>("")
  const [roomChannel, setRoomChannel] = useState<RtmChannel>()
  const [messages, setMessages] = useState<Message[]>([])
  const sendMessage = trpc.useMutation("room.saveMessage")
  const deleteRoom = trpc.useMutation("room.deleteRoom")

  const getMessages = trpc.useQuery(
    [
      "room.getMessages",
      {
        roomId: selectedRoomId,
      },
    ],
    {
      enabled: false,
      onSuccess: (initialMessages: Message[]) => {
        setMessages(initialMessages)
      },
    }
  )

  const handleChatTyped = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const handleDeleteRoom = async () => {
    await deleteRoom.mutateAsync({
      roomId: selectedRoomId,
    })
    refetchRooms()
    setSelectedRoomId("")
    // router.push("/dashboard")
  }

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!roomChannel) return
    if (!text) return
    roomChannel.sendMessage({
      text: JSON.stringify({
        userId: user.id,
        text,
        name: user.name,
      }),
    })
    sendMessage.mutate({
      text,
      userId: user.id,
      name: user.name,
      roomId: selectedRoomId,
    })
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text,
        userId: user.id,
        name: user.name,
      },
    ])
    setText("")
  }

  useEffect(() => {
    if (!messagesRef.current) return
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    const connectToRoom = async () => {
      await getMessages.refetch()
      const channel = await client.createChannel(selectedRoomId)
      await channel.join()
      channel.on("ChannelMessage", (message) => {
        if (!message.text) return
        const messageObj = JSON.parse(message.text)
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...messageObj,
          },
        ])
      })
      setRoomChannel(channel)
      return {
        channel,
      }
    }

    const clientPromise = connectToRoom()

    return () => {
      clientPromise.then(async (context) => {
        if (!context) return
        const { channel } = context
        await channel.leave()
        setRoomChannel(undefined)
        // // setMessages([])
      })
    }
  }, [selectedRoomId])

  if (!selectedRoomId) return <></>
  return (
    <div className="flex gap-4 h-full">
      <div className="flex flex-col flex-grow gap-4 p-4">
        <div>You are in the {selectedRoomName} room</div>
        <div
          ref={messagesRef}
          className="h-64 w-[30rem] bg-white border rounded p-4 overflow-auto"
        >
          {messages.map((message, index) => (
            <div key={message.userId}>
              {message.name}: {message.text}
            </div>
          ))}
        </div>
        <form className="flex gap-4" onSubmit={handleSendMessage}>
          <input
            value={text}
            placeholder="type a message here"
            onChange={handleChatTyped}
            className="p-2 text-md border"
          />
          <div className="flex gap-4">
            <Button variant={Variant.Primary}>Send</Button>
            <Button onClick={handleDeleteRoom} variant={Variant.Danger}>
              Delete Room
            </Button>
          </div>
        </form>
      </div>
      <UsersPanel selectedRoomId={selectedRoomId}></UsersPanel>
    </div>
  )
}

export default ChatPanel
