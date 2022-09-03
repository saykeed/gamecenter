

import { useTicGameHandler } from "../tictactoe/HandleTicGame";
import { useSocket } from '../socket/UseSocket';
import { useLoader } from "../UseLoader";
import { useAlert } from "../UseAlert";
import router from "../../router";
import { useChat } from "./HandleChat";
import { useVideoChat } from "./HandleVideoChat";

const { openLoader, closeLoader } = useLoader()
const { openAlert } = useAlert()
const { socket, connectSocket } = useSocket()
const { handleMessages } = useChat()
const { handleGameUpdate, handleGameStart, setupFirstSocket, handleGameEnd } = useTicGameHandler();
const { handleIncomingWebrtcData } = useVideoChat()

export const useHandleConnection = () => {
   
    const joinRoom = (id:any, socket:any) => {
        return new Promise((rs, rj) => {
            socket.emit('roomId', id)
            socket.on('joinedRoomSuccessfully', () => { rs(true) })
            socket.on('joinRoomError', () => { rj('Room is full') })
        })
    }

    const makeConnection = (id:any) => {
        openLoader('Joining Game Room')
        connectSocket()
        .then((socket) => {
            closeLoader()
            joinRoom(id, socket)
            .then(() => {
                handleGameStart()
                handleGameUpdate()
                setupFirstSocket()
                handleGameEnd()
                handleMessages()
                handleIncomingWebrtcData()
            })
            .catch((err) => {
                openAlert(err)
                router.push('/games/tictactoe')
            })
        })
        .catch((err) => {
            closeLoader()
            console.log(err)
            openAlert('Could not join room')
            router.push('/games/tictactoe')
        })
    }

    const socketEmit = (event:string, data?:any) => {
        socket.value?.emit(event, data)
    }

    const socketListener = (event:string) => {
        return new Promise<any>((rs, rj) => {
            socket.value?.on(event, (data) => {
                rs(data)
            })
            
        })
    }
    

    
    

    return { joinRoom, makeConnection, socketEmit, socketListener }
}