import { NextPage } from "next"
import React, { useContext, useState } from "react"
import Button, { Variant } from "../components/Button"
import ChatPanel from "../components/dashboard/ChatPanel"
import { CreateRoomModal } from "../components/dashboard/CreateRoomModal"
import { UserContext } from "../context/UserContext"
import { trpc } from "../utils/trpc"

const SERVER_ID = "cl77kxbjm0010ogpomw3blbyc"

const DashboardPage: NextPage = () => {
  const { user } = useContext(UserContext)
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
  const getServers = trpc.useQuery(["user.getServers", { userId: user.id }])
  const createRoom = trpc.useMutation("server.createRoom")
  const getRooms = trpc.useQuery(["server.getRooms", { serverId: SERVER_ID }])
  const [selectedRoom, setSelectedRoom] = useState<string>()

  const handleCloseRoomModal = () => {
    setShowCreateRoomModal(false)
  }

  const handleShowRoomModal = () => {
    setShowCreateRoomModal(true)
  }

  const handleCreateRoom = async (roomName: string) => {
    await createRoom.mutateAsync({
      name: roomName,
      serverId: SERVER_ID, //HARD CODED
    })
    await getRooms.refetch()
  }

  const handleRoomSelected = (roomId: string) => {
    setSelectedRoom(roomId)
  }

  return (
    <>
      <div className="h-full flex">
        <div className="w-16 bg-gray-200 h-full flex justify-center pt-4">
          {getServers.data?.map((server) => (
            <div
              className="rounded-full bg-blue-300 hover:bg-blue-200 cursor-pointer w-12 h-12 flex justify-center items-center"
              key={server.serverId}
            >
              {server.serverId.charAt(0)}
            </div>
          ))}
        </div>
        {/* ROOMS */}
        <div className="w-60 bg-gray-100 h-full p-4">
          <div className="flex flex-col gap-2 items-start mb-4">
            {getRooms.data?.map((room) => (
              <button
                onClick={() => handleRoomSelected(room.id)}
                className="hover:text-blue-500"
                key={room.id}
              >
                {room.name}
              </button>
            ))}
          </div>
          <Button variant={Variant.Primary} onClick={handleShowRoomModal}>
            Create Room
          </Button>
        </div>

        {/* CHAT PANEL */}
        <div className="flex-grow bg-gray-50 h-full p-4">
          <ChatPanel selectedRoom={selectedRoom} />
        </div>
      </div>

      <CreateRoomModal
        onCreateRoom={handleCreateRoom}
        isOpen={showCreateRoomModal}
        onClose={handleCloseRoomModal}
      />
    </>
  )
}

export default DashboardPage
