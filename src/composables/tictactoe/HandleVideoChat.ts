import { ref } from 'vue'
import { useSocket } from '../socket/UseSocket'
import { useAlert } from '../UseAlert'
import { useModal } from '../UseModal'
import { Peer } from "peerjs";
import { useLoader } from '../UseLoader';

const { socket } = useSocket()
const { openAlert } = useAlert()
const { openModal } = useModal()
const { openLoader, closeLoader } = useLoader()




let peer: Peer;
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

	async function getConnectedDevices(type: string) {
		if (navigator.mediaDevices) {
			const devices = await navigator.mediaDevices.enumerateDevices();
			return devices.filter(device => device.kind === type)
		} else {
			openAlert('can not open media devices')
		}

	}

	async function openCamera(cameraId: string) {
		const constraints = {
			'audio': { 'echoCancellation': true },
			'video': {
				'deviceId': cameraId
			}
		}

		return await navigator.mediaDevices.getUserMedia(constraints);
	}

	const getLocalSteam = async () => {
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

	const selectDevice = (selectedCam: MediaDeviceInfo) => {
		openCamera(selectedCam.deviceId).then(dataStream => {
			stream.value = dataStream
		})
	}



	async function makeCall() {

		socket.value?.emit('outgoingOffer', peer.id)
		openLoader('Waiting for opponent to receive call')
		peer.on("connection", (conn) => {
			conn.on("data", (data) => {
				closeLoader()
				console.log(data);
			});
		});
		socket.value?.on('callRejected', () => {
			closeLoader()
			openAlert('call rejected')
			return;
		})

	}

	const handleIncomingWebrtcData = () => {
		peer = new Peer(`saykeed-game-center-${new Date().getTime()}`);

		peer.on("connection", (conn) => {
			conn.on("data", (data) => {
				console.log(data);
			});
			conn.on("open", () => {
				conn.send("caller");
			});
		});

		peer.on('call', (call) => {
			navigator.mediaDevices.getUserMedia({video: true, audio: true})
			  .then((localStream) => {
				stream.value = localStream
				call.answer(localStream);
				videoCallStatus.value = true
				call.on('stream', (remoteVid) => {
					remoteStream.value = remoteVid
				});
			  })
			  .catch((err) => {
				console.error('Failed to get local stream', err);
			  });
		  });

		socket.value?.on('incomingOffer', async (id) => {
			if (id) {
				let accept = confirm('Opponent requests a video call')
				if (accept) {
					startCall(id)
				} else {
					socket.value?.emit('rejectCall')
				}
			}
		})

	}

	const startCall = async (id: any) => {
		const conn = peer.connect(id)
		conn.on("data", (data) => {
			console.log(data);
		});
		conn.on("open", () => {
			conn.send("receiver");
		});

		navigator.mediaDevices.getUserMedia({video: true, audio: true})
		.then((localStream) => {
			stream.value = localStream
			videoCallStatus.value = true
			let call = peer.call(id, localStream);
			call.on('stream', (remoteVid) => {
				remoteStream.value = remoteVid
			});
		})
		.catch((err) => {
			console.log('Failed to get local stream', err);
		});

	}



	return { selectDevice, stream, remoteStream, handleIncomingWebrtcData, videoCallStatus, makeCall }
}



const videoChatOptions = ref(false)
const audioStatus = ref(true)
const videoStatus = ref(true)
const minimizeVideoChat = ref(false)

export const useVideoChatOptions = () => {
	const toggleVideoChatOptions = () => {
		videoChatOptions.value = !videoChatOptions.value
	}

	const controlAudio = (stream: MediaStream | undefined) => {
		audioStatus.value = !audioStatus.value
		stream?.getTracks().forEach(track => {
			if (track.kind === 'audio') {
				track.enabled = audioStatus.value
				//   console.log(track)
			}
		})
	}

	const controlVideo = (stream: MediaStream | undefined) => {
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
		if (remoteStream.value != undefined) {
			remoteStream.value?.getTracks().forEach(track => track.stop())
		}
		if (overSeerPeerConn.value != undefined) {
			overSeerPeerConn.value?.close()
		}
		stream.value = undefined
		remoteStream.value = undefined
		videoCallStatus.value = false
	}

	return { videoChatOptions, toggleVideoChatOptions, audioStatus, videoStatus, controlAudio, controlVideo, minimizeVideoChat, controlVideoChatLayout, hangUp }
}




















// const addStreamToRTC = (stream:MediaStream | undefined, peerConn:RTCPeerConnection) => {
// 	stream?.getTracks().forEach(track => {
// 		peerConn.addTrack(track, stream);
// 	});
// 	console.log('stream sent out')
// }
// const localIceListener = (peerConn:RTCPeerConnection, socketEventName:string) => {
// 	peerConn.addEventListener('icecandidate', event => {
// 		if (event.candidate) {
// 			socket.value?.emit(socketEventName, event.candidate)
// 		}
// 		console.log('ice sent out')
// 	});
// }
// const confirmPeerConnection = (peerConn:RTCPeerConnection) => {
// 	peerConn.addEventListener('connectionstatechange', event => {
// 		if (peerConn.connectionState === 'connected') {
// 			openAlert('Peers Connected successfully')
// 		}
// 	});
// }

// const confirmIceConnectionState = (peerConn:RTCPeerConnection) => {
// 	if(peerConn.iceConnectionState === 'failed') {
// 		openAlert('ice connection failed')
// 	} else if(peerConn.iceConnectionState === 'completed') {
// 		openAlert('ice connection completed')
// 	} else if(peerConn.iceConnectionState === 'disconnected') {
// 		openAlert('ice connection disconnected')
// 	} else if(peerConn.iceConnectionState === 'connected') {
// 		openAlert('ice connected')
// 	}
// }

// const remoteTrackListener = (peerConn:RTCPeerConnection) => {
// 	peerConn.addEventListener('track', async (event) => {
// 		console.log('remote stream received')
// 		const [Stream] = event.streams;
// 		remoteStream.value = Stream
// 		console.log(remoteStream.value)
// 		// event.streams[0].getTracks().forEach(track => {
// 		// 	console.log('Add a track to the remoteStream:', track);
// 		// 	remoteStream.addTrack(track);
// 		// });
// 	});
// }