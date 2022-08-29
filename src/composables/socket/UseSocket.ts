import { io, Socket } from "socket.io-client";
import { ref } from 'vue'


const socket = ref<Socket>()


export const useSocket = () => {
    const connectSocket = () => {
        return new Promise<any>((rs, rj) => {
            socket.value = io("http://localhost:1234/");
            
            socket.value.on('connect', () => {
                rs(socket.value)
            })

            socket.value.on("connect_error", (err) => {
                rj(err)
            });
        })
    }
    
    return { socket, connectSocket}
}