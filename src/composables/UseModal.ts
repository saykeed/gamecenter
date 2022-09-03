import {ref} from 'vue'

const modalStatus = ref(false)
const modalOptions = ref<MediaDeviceInfo[]>()

export const useModal = () => {

    const openModal = (arr:MediaDeviceInfo[] | undefined) => {
        modalOptions.value = arr
        modalStatus.value = true
    }

    const closeModal = () => {
        modalOptions.value = []
        modalStatus.value = false
    }

    return {modalStatus, modalOptions, openModal, closeModal}
}