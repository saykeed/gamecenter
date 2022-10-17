import { useHandleConnection } from "./tictactoe/HandleConnection";
import { useStoredData } from "./UseStorage";

const { roomId } = useStoredData()
const { makeConnection } = useHandleConnection()


const beforeUnloadListener = (event:any) => {
    event.preventDefault()
    makeConnection(roomId.value)
    return event.returnValue = 'You are About to leave the room, automatic forfeit'
    
}

export const disableReload = () => {
    addEventListener('beforeunload', beforeUnloadListener, { capture: true })
}
export const enableReload = () => {
    removeEventListener('beforeunload', beforeUnloadListener, { capture: true })
}