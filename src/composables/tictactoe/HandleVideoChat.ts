import {ref} from 'vue'
import { useSocket } from '../socket/UseSocket'
import { useAlert } from '../UseAlert'
import { useModal } from '../UseModal'

const { socket } = useSocket()
const { openAlert } = useAlert()
const { openModal } =  useModal()




const videoCallStatus = ref(false)
const userType = ref('')
let receivedOffer = ref<any>()
const stream = ref<MediaStream>()
const remoteStream = ref<MediaStream>()
let overSeerPeerConn = ref<RTCPeerConnection>()
// let remoteStream = new MediaStream()
// const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
const configuration = {
    iceServers: [
        {
          urls: [
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
const joinConfig = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
	// iceServers: [
    //     // {
    //     //   urls: [
    //     //     'stun:stun1.l.google.com:19302',
    //     //     'stun:stun2.l.google.com:19302',
    //     //   ],
    //     // },
    //     {
    //       urls: "turn:openrelay.metered.ca:80",
    //       username: "openrelayproject",
    //       credential: "openrelayproject"
    //     },
    //     {
    //       urls: "turn:openrelay.metered.ca:443",
    //       username: "openrelayproject",
    //       credential: "openrelayproject"
    //     },
    //     {
    //       urls: "turn:openrelay.metered.ca:443?transport=tcp",
    //       username: "openrelayproject",
    //       credential: "openrelayproject"
    //     }
    // ],
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
        console.log('stream sent out')
    }
    const localIceListener = (peerConn:RTCPeerConnection, socketEventName:string) => {
        peerConn.addEventListener('icecandidate', event => {
            if (event.candidate) {
                socket.value?.emit(socketEventName, event.candidate)
            }
            console.log('ice sent out')
        });
    }
    const confirmPeerConnection = (peerConn:RTCPeerConnection) => {
        peerConn.addEventListener('connectionstatechange', event => {
            if (peerConn.connectionState === 'connected') {
                openAlert('Peers Connected successfully')
            }
        });
    }

	const confirmIceConnectionState = (peerConn:RTCPeerConnection) => {
		if(peerConn.iceConnectionState === 'failed') {
			openAlert('ice connection failed')
		} else if(peerConn.iceConnectionState === 'completed') {
			openAlert('ice connection completed')
		} else if(peerConn.iceConnectionState === 'disconnected') {
			openAlert('ice connection disconnected')
		} else if(peerConn.iceConnectionState === 'connected') {
			openAlert('ice connected')
		} 
	}

    const remoteTrackListener = (peerConn:RTCPeerConnection) => {
        peerConn.addEventListener('track', async (event) => {
            console.log('remote stream received')
            const [Stream] = event.streams;
            remoteStream.value = Stream
            console.log(remoteStream.value)
			// event.streams[0].getTracks().forEach(track => {
			// 	console.log('Add a track to the remoteStream:', track);
			// 	remoteStream.addTrack(track);
			// });
        });
    }

    async function makeCall() {
        videoCallStatus.value = true
        const peerConnection = new RTCPeerConnection(configuration);
        addStreamToRTC(stream.value, peerConnection)
		localIceListener(peerConnection, 'outgoingSenderIceCandidate')
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
		console.log('offer sent out')
        socket.value?.emit('outgoingOffer', offer)
        remoteTrackListener(peerConnection)
		socket.value?.on('incomingAnswer', async (ans) => {
            if(ans) {
                const remoteDesc = new RTCSessionDescription(ans);
                await peerConnection.setRemoteDescription(remoteDesc);
				console.log('remote description set')
				addIncomingIce()
            }
        })
		const addIncomingIce = () => {
			socket.value?.on('incomingReceiverIceCandidate', async (ice) => {
				if(ice) {
					console.log('received ice')
					try {
						await peerConnection.addIceCandidate(ice);
						confirmIceConnectionState(peerConnection)
					} catch (e) {
						console.error('Error adding received ice candidate', e);
					}
				}
			})
		}
		
        confirmPeerConnection(peerConnection)
        socket.value?.on('callRejected', () => {
            openAlert('Ooops!!! Opponent did not accept your video call request')
            videoCallStatus.value = false
        })
		overSeerPeerConn.value = peerConnection
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
        const peerConnection = new RTCPeerConnection(joinConfig);
        addStreamToRTC(stream.value, peerConnection) 
		localIceListener(peerConnection, 'outgoingReceiverIceCandidate')
        remoteTrackListener(peerConnection)  
        await peerConnection.setRemoteDescription(new RTCSessionDescription(receivedOffer.value));
		console.log('remote description set')
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.value?.emit('outgoingAnswer', answer)
        socket.value?.on('incomingSenderIceCandidate', async (ice) => {
            if(ice) {
                console.log('received ice')
				console.log(ice)
                try {
                    await peerConnection.addIceCandidate(ice);
					confirmIceConnectionState(peerConnection)
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }
        })
        confirmPeerConnection(peerConnection)
		overSeerPeerConn.value = peerConnection
    }


    return { requestVideoChat, selectDevice, stream, remoteStream, handleIncomingWebrtcData, videoCallStatus}
}



const videoChatOptions = ref(false)
const audioStatus = ref(true)
const videoStatus = ref(true)
const minimizeVideoChat = ref(false)

export const useVideoChatOptions = () => {
    const toggleVideoChatOptions = () => {
        videoChatOptions.value = !videoChatOptions.value
    }

    const controlAudio = (stream:MediaStream | undefined) => {
        audioStatus.value = !audioStatus.value
        stream?.getTracks().forEach(track => {
            if (track.kind === 'audio') {
              track.enabled = audioStatus.value
            //   console.log(track)
            }
        })
    }

    const controlVideo = (stream:MediaStream | undefined) => {
        videoStatus.value = !videoStatus.value
        stream?.getTracks().forEach(track => {
            if (track.kind === 'video') {
              track.enabled = videoStatus.value
            //   console.log(track)
            }
        })
    }

    const controlVideoChatLayout = () => {
        minimizeVideoChat.value = !minimizeVideoChat.value
    }

	const hangUp = () => {
		stream.value?.getTracks().forEach(track => track.stop())
		if(remoteStream.value != undefined) {
			remoteStream.value?.getTracks().forEach(track => track.stop())
		}
		if(overSeerPeerConn.value != undefined) {
			overSeerPeerConn.value?.close()
		}
		stream.value = undefined
		remoteStream.value = undefined
		videoCallStatus.value = false
	}

    return { videoChatOptions, toggleVideoChatOptions, audioStatus, videoStatus, controlAudio, controlVideo, minimizeVideoChat, controlVideoChatLayout, hangUp }
}