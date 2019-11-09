import { createContext } from 'react'
import openSocket from 'socket.io-client'
import { HOST } from './constants'

export const io = openSocket(HOST)

export const IoContext = createContext(io)
