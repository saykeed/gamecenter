import {ref} from 'vue'
import { useSocket } from '../socket/UseSocket'


const { socket } = useSocket()

const chatStatus = ref(false)
const inboxMsg = ref('')


export const useChat = () => {

    const openChat = () => {
        chatStatus.value = true
    }

    const closeChat = () => {
        chatStatus.value = false
    }

    const handleMessages = () => {
        socket.value?.on('receivedMessage', (msg) => {
            chatStatus.value = true
            setTimeout(() => {
                inboxMsg.value = msg 
            }, 200);
        })
    }

    return { chatStatus, openChat, closeChat, inboxMsg, handleMessages }
}