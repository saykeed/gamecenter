import {ref} from 'vue'
import Cam from '../Interface/cam'

const modalStatus = ref(false)
const modalOptions = ref<Cam[]>()

export const useModal = () => {

    const openModal = (arr:Cam[]) => {
        modalOptions.value = arr
        modalStatus.value = true
    }

    const closeModal = () => {
        modalOptions.value = []
        modalStatus.value = false
    }

    return {modalStatus, modalOptions, openModal, closeModal}
}