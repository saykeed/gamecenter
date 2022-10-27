
<template>
    <transition name="alert">
        <div class="alert bg-primary rounded-xl px-3 py-6 fixed top-5 left-5 text-white z-50 w-[80%] max-w-[350px]" v-if="alertStatus" @click="closeAlert">
            <i class="material-icons absolute top-1 right-2 text-xl cursor-pointer font-semibold hover:text-2xl hover:font-bold transition-all" @click="closeAlert">close</i>
            {{alertMsg}}
        </div>
    </transition>
</template>

<script setup lang="ts">
    import { useAlert } from '../../composables/UseAlert';

    const { alertStatus, alertMsg, closeAlert } = useAlert()
    
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
