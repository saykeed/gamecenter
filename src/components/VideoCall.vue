
<template>
    <div class="videoCall w-screen h-screen fixed top-0 left-0 z-20 bg-[black]"  >
        <video id="remoteVid"  autoplay muted
            class="remoteVid absolute w-full h-full top-0 left-0 border border-red-600">
        </video>
        <video id="localVid" autoplay muted
            class="localVid absolute w-[30%] max-w-[150px] h-[200px] top-5 left-5 border border-slate-300 rounded-2xl">
        </video>
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    import {useVideoChat } from '../composables/tictactoe/HandleVideoChat'

    const { stream, remoteStream } = useVideoChat()

    onMounted(() => {
        let local:any = document.querySelector('.localVid')
        local.srcObject = stream.value;
        let remote:any = document.querySelector('.remoteVid')
        remote.srcObject = stream.value;
    })
    
    
</script>

<style scoped>
    
    
</style>
