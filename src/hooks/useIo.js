import { useContext } from 'react'
import { IoContext } from '../context'

export default function useIo () {
  return useContext(IoContext)
}
