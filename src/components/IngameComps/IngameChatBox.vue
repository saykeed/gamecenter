
<template>
    <div v-show="chatStatus" class="chatbox-background w-screen h-screen min-h-screen bg-[rgba(0,0,0,0.800)] fixed top-0 left-0 overflow-auto z-20 flex items-center justify-center p-5" >
        
        <div class="chatbox w-[85%] max-w-[400px] h-[300px] bg-white flex flex-col p-2 rounded z-40">
            <div class="msgBox h-[200px] border border-primary rounded mb-10 p-1 overflow-auto">
                <!-- <div class="msgWrapper sent-message-wrapper">
                    <div class="sent-message">hello</div>
                </div>
                <div class="msgWrapper received-message-wrapper">
                    <div class="received-message">whatsup lknfl lnflskdnf lknlk nlnlknflk lknflksnflk lnlk lnflkn l</div>
                </div> -->
                
            </div>

            <div class="inputBox flex items-center justify-between">
                <input type="text" class="w-[80%] border border-primary outline-none focus:border-2 px-2 py-1 rounded" v-model="inputMsg">
                <button class="bg-primary text-white flex items-center justify-center h-10 w-10 rounded-full" @click="sendMessage">
                    <i class="material-icons cursor-pointer">send</i>
                </button>
            </div>
        </div>

        <div class="chatbox-background absolute top-0 bg-red-600left-0 w-full h-full z-30" @click="closeChat"></div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { useChat } from '../../composables/tictactoe/HandleChat';
    import { useSocket } from '../../composables/socket/UseSocket';

    const { chatStatus, closeChat, inboxMsg } = useChat()
    const { socket } =  useSocket()
    const inputMsg = ref('')

    const sendMessage = () => {
        let box:any = document.querySelector('.msgBox')
        box.innerHTML += `<div class="sent-message-wrapper"><div class="sent-message">${inputMsg.value}</div></div>`
        socket.value?.emit('sentMessage', inputMsg.value)
        inputMsg.value = ''
		let lastChild:any = document.querySelector('.sent-message-wrapper:last-child')
		lastChild.scrollIntoView({behavior: 'smooth'})
    }

    const receiveMessage = (msg:string) => {
        let box:any = document.querySelector('.msgBox')
        box.innerHTML += `<div class="received-message-wrapper"><div class="received-message">${msg}</div></div>`
		let lastChild:any = document.querySelector('.received-message-wrapper:last-child')
		lastChild.scrollIntoView({behavior: 'smooth'})
    }

    watch(inboxMsg, (newMsg) => {
        // alert(newMsg)
        receiveMessage(newMsg)
    })
</script>

<style scoped>
    
</style>
