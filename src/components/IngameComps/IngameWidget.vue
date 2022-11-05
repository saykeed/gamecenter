
<template>
    <div class="chatwidget absolute top-3 right-5 rounded-full h-[100px] flex flex-col align-center justify-between p-2 bg-primary text-white opacity-50 hover:opacity-100 cursor-default">
        <i class="material-icons cursor-pointer" @click="openChat">chat</i>
        <i class="material-icons cursor-pointer" @click="makeCall">videocam</i>
    </div>
</template>

<script setup lang="ts">
    import { useChat } from '../../composables/tictactoe/HandleChat';
    import { useVideoChat } from '../../composables/tictactoe/HandleVideoChat';

    const { openChat } = useChat()
    const { requestVideoChat, makeCall } = useVideoChat()


    
        
</script>

<style scoped>
    
</style>
