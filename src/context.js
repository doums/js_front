import { createContext } from 'react'
import openSocket from 'socket.io-client'

export const io = openSocket('http://localhost:4000')

export const IoContext = createContext(io)
