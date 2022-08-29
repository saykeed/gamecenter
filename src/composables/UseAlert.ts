import {ref} from 'vue'


const alertStatus = ref(false)
const alertMsg = ref('i am the alert box lorem ipsume jlaklm blml fsn mdklkfndsl flkfndslk fndknfdlk fdlknlkm lknlkdnfl')
export const useAlert = () => {

    const openAlert = (msg:string) => {
        alertMsg.value = msg
        alertStatus.value = true
    }

    const closeAlert = () => {
        alertStatus.value = false
        alertMsg.value = ''
    }

    return {alertStatus, alertMsg, openAlert, closeAlert}
}