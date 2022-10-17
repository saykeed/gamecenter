import {ref} from 'vue'


const roomId = ref('')

export const useStoredData = () => {

    const setRoomId = (id:any) => {
        roomId.value = id
    }

    return { roomId, setRoomId }
}