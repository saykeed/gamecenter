
<template>
    <div class="promptModal fixed top-0 left-0 w-full h-full flex items-center justify-center z-20" v-if="modalStatus">
        <div class="modalBackground absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.800)] z-30"></div>
        <div class="actualModal h-[200px] w-[80%] max-w-[400px] bg-white rounded z-40 overflow-auto">
            <button v-for="item in modalOptions" :key="item.deviceId" @click="selected(item)"
                class="w-full p-1 my-1 text-primary hover:bg-primary hover:text-white"
            >
                {{item.label}}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useModal } from '../../composables/UseModal'
    import {useVideoChat } from '../../composables/tictactoe/HandleVideoChat'

    const {modalStatus, modalOptions, closeModal } = useModal()
    const { selectDevice } = useVideoChat()

    const selected = (item:MediaDeviceInfo) => {
        selectDevice(item)
        closeModal()
    }
    
</script>

<style scoped>
    
    .alert-enter-active{
        animation: alertEnter .3s ease-in-out;
    }

    .alert-leave-active{
        animation: alertLeave .3s ease-in-out;
    }

    @keyframes alertEnter {
        0% {transform: translateX(-100%)}
        60% {transform: translateX(0%)}
        70% {transform: translateX(5%)}
        80% {transform: translateX(0%)}
        90% {transform: translateX(-5%)}
        100% {transform: translateX(0%)}
    }

    @keyframes alertLeave {
        0% {transform: translateX(0%)}
        70% {transform: translateX(15%)}
        100% {transform: translateX(-100%)}
    }

</style>
