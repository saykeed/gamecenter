
<template>
    <div class="videoCall w-full h-full fixed bottom-0 left-0 z-20 bg-[black] transition-all" :class="{'h-[10%] min-h-14 w-[80%] bottom-5 left-1/2 -translate-x-1/2 rounded-lg' : minimizeVideoChat}" >
        <button class="inVidButton bg-slate-500 absolute top-3 right-5 z-20" @click="controlVideoChatLayout" 
            :class="{'top-1/2 -translate-y-1/2 ': minimizeVideoChat}"
        >
            <i class="material-icons">{{minimizeVideoChat ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</i>
        </button>
        <video id="remoteVid" autoplay :class="{'hidden': minimizeVideoChat}" @click="toggleVideoChatOptions"
            class="remoteVid absolute w-full h-full top-0 left-0 border border-red-600">
        </video>
        <video id="localVid" autoplay muted :class="{'hidden': minimizeVideoChat}"
            class="localVid absolute w-[30%] max-w-[150px] h-[200px] top-5 left-5 border border-slate-300 rounded-2xl">
        </video>
        <transition name="options">
            <div class="optionsContainer absolute bottom-10 left-0 w-full h-fit flex items-center justify-center" :class="{'hidden': minimizeVideoChat}" v-if="videoChatOptions">
                <div class="options w-[80%] max-w-[600px] flex items-center justify-between text-white">
                    <button class="inVidButton" @click="controlAudio(stream)"
                        :class="{'bg-ash' : audioStatus, 'bg-red' : !audioStatus}" 
                    >
                        <i class="material-icons">{{audioStatus ? 'mic' : 'mic_off'}}</i>
                    </button>
                    <button class="inVidButton" @click="controlVideo(stream)"
                        :class="{'bg-ash' : videoStatus, 'bg-red' : !videoStatus}" 
                    >
                        <i class="material-icons">{{videoStatus ? 'videocam' : 'videocam_off'}}</i>
                    </button>
                    <button class="bg-slate-500 inVidButton">
                        <i class="material-icons">phone</i>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, watch } from 'vue';
    import {useVideoChat, useVideoChatOptions } from '../composables/tictactoe/HandleVideoChat'

    const { stream, remoteStream } = useVideoChat()
    const { videoChatOptions, toggleVideoChatOptions, audioStatus,
        videoStatus, controlAudio, controlVideo, minimizeVideoChat, controlVideoChatLayout } = useVideoChatOptions()

    onMounted(() => {
        let local:any = document.querySelector('.localVid')
        local.srcObject = stream.value;
        
        watch(remoteStream, (newX) => {
            let remote:any = document.querySelector('.remoteVid')
            remote.srcObject = remoteStream.value;
        })
        
    })
    
    
</script>

<style scoped>
    .options-enter-from, .options-leave-to{
        opacity: 0;
        transform: translateY(50px);
    }
    .options-enter-active, .options-leave-active{
        transition: all .5s ease-in-out;
    }

</style>
