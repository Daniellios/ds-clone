import { User } from "@prisma/client"
import React from "react"

type UserContext = {
  user: User
  setUser: (user: User) => void
}

export const UserContext = React.createContext({
  user: {
    id: "",
    name: "",
  },
  setUser: (user: User): void => {},
})
