import {ref} from 'vue'
import { useSocket } from '../socket/UseSocket'
import { useAlert } from '../UseAlert'
import Cam from '../../Interface/cam'
import { useModal } from '../UseModal'
import { watch } from 'fs'


const { socket } = useSocket()
const { openAlert } = useAlert()
const { openModal } =  useModal()

const videoCallStatus = ref(false)
const userType = ref('')
let receivedOffer = ref<any>()
const stream = ref<MediaStream>()
const remoteStream = ref<MediaStream>()
// const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
const configuration = {
    iceServers: [
         {
             urls: [
                 "stun:openrelay.metered.ca:80",
                 'stun:stun1.l.google.com:19302',
                 'stun:stun2.l.google.com:19302',
             ],
         },
         {
             urls: "turn:openrelay.metered.ca:80",
             username: "openrelayproject",
             credential: "openrelayproject"
         },
         {
             urls: "turn:openrelay.metered.ca:443",
             username: "openrelayproject",
             credential: "openrelayproject"
         },
         {
             urls: "turn:openrelay.metered.ca:443?transport=tcp",
             username: "openrelayproject",
             credential: "openrelayproject"
         }
     ],
     iceCandidatePoolSize: 10,
}

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
            openAlert('can not open media devices')
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

    const requestVideoChat = async (user:string) => {
        userType.value = user
        navigator.mediaDevices.getUserMedia(constraints)
        .then(() => {
            getConnectedDevices('videoinput').then(data => {
                openModal(data)
            })
        })
        .catch(() => {
            openAlert('Could not access media devices')
        }) 
    }

    

    const selectDevice = (selectedCam:MediaDeviceInfo) => {
        openCamera(selectedCam.deviceId).then(dataStream => {
            stream.value = dataStream
            if(userType.value === 'sender') {
                makeCall()
            } else {
                receiveCall()
            }
        })
    }

    const addStreamToRTC = (stream:MediaStream | undefined, peerConn:RTCPeerConnection) => {
        stream?.getTracks().forEach(track => {
            peerConn.addTrack(track, stream);
        });
    }
    const localIceListener = (peerConn:RTCPeerConnection, socketEventName:string) => {
        peerConn.addEventListener('icecandidate', event => {
            if (event.candidate) {
                socket.value?.emit(socketEventName, event.candidate)
            }
        });
    }
    const confirmPeerConnection = (peerConn:RTCPeerConnection) => {
        peerConn.addEventListener('connectionstatechange', event => {
            if (peerConn.connectionState === 'connected') {
                openAlert('Peers Connected successfully')
            }
        });
    }

    const remoteTrackListener = (peerConn:RTCPeerConnection) => {
        peerConn.addEventListener('track', async (event) => {
            const [Stream] = event.streams;
            remoteStream.value = Stream
            console.log(remoteStream.value)
        });
    }

    async function makeCall() {
        videoCallStatus.value = true
        const peerConnection = new RTCPeerConnection(configuration);
        socket.value?.on('incomingAnswer', async (ans) => {
            if(ans) {
                const remoteDesc = new RTCSessionDescription(ans);
                await peerConnection.setRemoteDescription(remoteDesc);
            }
        })
        socket.value?.on('incomingReceiverIceCandidate', async (ice) => {
            if(ice) {
                try {
                    await peerConnection.addIceCandidate(ice);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }
        })
        addStreamToRTC(stream.value, peerConnection)
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.value?.emit('outgoingOffer', offer)
        localIceListener(peerConnection, 'outgoingSenderIceCandidate')
        confirmPeerConnection(peerConnection)
        remoteTrackListener(peerConnection)
        socket.value?.on('callRejected', () => {
            openAlert('Ooops!!! Opponent did not accept your video call request')
            videoCallStatus.value = false
        })
    }
    
    const handleIncomingWebrtcData = () => {
        socket.value?.on('incomingOffer', async (offer) => {
            if (offer) {
                let accept = confirm('Opponent requests a video call')
                if(accept) {
                    receivedOffer.value = offer
                    requestVideoChat('receiver')
                } else {
                    socket.value?.emit('rejectCall')
                }
            }
        })
    }

    const receiveCall = async () => {
        videoCallStatus.value = true
        const peerConnection = new RTCPeerConnection(configuration);
        addStreamToRTC(stream.value, peerConnection)   
        peerConnection.setRemoteDescription(new RTCSessionDescription(receivedOffer.value));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.value?.emit('outgoingAnswer', answer)
        socket.value?.on('incomingSenderIceCandidate', async (ice) => {
            if(ice) {
                try {
                    await peerConnection.addIceCandidate(ice);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }
        })
        localIceListener(peerConnection, 'outgoingReceiverIceCandidate')
        confirmPeerConnection(peerConnection)
        remoteTrackListener(peerConnection)
    }

    return { requestVideoChat, selectDevice, stream, remoteStream, handleIncomingWebrtcData, videoCallStatus}
}