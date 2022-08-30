import {ref} from 'vue'
import { useSocket } from '../socket/UseSocket'
import { useAlert } from '../UseAlert'
import Cam from '../../Interface/cam'
import { useModal } from '../UseModal'


const { socket } = useSocket()
const { openAlert } = useAlert()
const { openModal, modalOptions } =  useModal()

const chatStatus = ref(false)
const stream = ref<MediaStream>()


export const useVideoChat = () => {
    const constraints = {
        'video': true,
        'audio': true
    }

    async function getConnectedDevices(type:string) {
        if(navigator.mediaDevices) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.filter(device => device.kind === type)
        } else {
            openAlert('can not open media devices ')
        }
        
    }

    async function openCamera(cameraId:string) {
        const constraints = {
            'audio': {'echoCancellation': true},
            'video': {
                'deviceId': cameraId
                }
            }
    
        return await navigator.mediaDevices.getUserMedia(constraints);
    }

    const requestVideoChat = async () => {
        navigator.mediaDevices.getUserMedia(constraints)
        .then(() => {
            getConnectedDevices('videoinput').then(data => {
                openModal(data)
            })
        })
        .catch(() => {
            openAlert('Could not access media devices')
        })
        // .then(stream => {
        //     console.log('Got MediaStream:', stream);
        // })
        // .catch(error => {
        //     console.error('Error accessing media devices.', error);
        //     openAlert('Could not access media devices')
        // });

        
        
    }

    const selectDevice = (selectedCam:MediaDeviceInfo) => {
        openCamera(selectedCam.deviceId).then(dataStream => {
            console.log(dataStream)
            stream.value = dataStream
        })
    }

    

    // const handleMessages = () => {
    //     socket.value?.on('receivedMessage', (msg) => {
    //         chatStatus.value = true
    //         setTimeout(() => {
    //             inboxMsg.value = msg 
    //         }, 200);
    //     })
    // }

    return { requestVideoChat, selectDevice, stream}
}