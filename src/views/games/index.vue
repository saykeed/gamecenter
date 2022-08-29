
<template>
    <other-pages>
        <h1 class="text-white text-3xl sm:text-5xl font-bold text-center mt-10">Select a Game below</h1>
        <transition-group tag="div" appear name="slideUp"
        class="gamesWrapper p-5 flex items-start justify-center md:justify-between overflow-hidden">
            <div v-for="game in games" :key="game.text" class="p-2 bg-primary w-fit rounded-lg">
                <div class="bg-white h-auto w-fit p-5 flex flex-col items-center justify-between">
                    <img :src="getImageUrl(game.imgPath)" class="w-48 sm:w-64" alt="game img">
                    <p class="font-semibold text-lg">{{game.text}}</p>
                    <router-link :to="game.route" class="w-full text-center  py-1 bg-primary text-white rounded-full mt-3">Play</router-link>
                </div>
            </div>
        </transition-group>
    </other-pages>
</template>

<script setup lang="ts" >
    import {useGames} from '../../composables/UseGames'
    

import { onMounted, ref } from 'vue';
    const games = ref()
    const getImageUrl = (imgName:string) => {
        return new URL(`../../assets/img/gamesImg/${imgName}.png`, import.meta.url).href
    }

    onMounted(() => {
        games.value = useGames()
    })

    
</script>

<style scoped>
    .slideUp-enter-from{
        transform: translateY(70px)
    }
    .slideUp-enter-active{
        transition: all .2s linear;
    }
</style>
