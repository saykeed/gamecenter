import {ref} from 'vue'
import Cam from '../Interface/cam'

const modalStatus = ref(false)
const modalOptions = ref<any[]>()

export const useModal = () => {

    const openModal = (arr:any) => {
        modalOptions.value = arr
        modalStatus.value = true
    }

    const closeModal = () => {
        modalOptions.value = []
        modalStatus.value = false
    }

    return {modalStatus, modalOptions, openModal, closeModal}
}