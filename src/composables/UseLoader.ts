import {ref} from 'vue'


const loaderStatus = ref(false)
const loaderMsg = ref('Setting things up')
export const useLoader = () => {

    const openLoader = (msg?:string) => {
        msg ? loaderMsg.value = msg : loaderMsg.value = 'Setting things up'
        loaderStatus.value = true
    }

    const closeLoader = () => {
        loaderStatus.value = false
        loaderMsg.value = ''
    }

    return {loaderStatus, loaderMsg, openLoader, closeLoader}
}