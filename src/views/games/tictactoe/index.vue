
<template>
    <other-pages>
        <h1 class="text-white text-3xl sm:text-5xl font-bold text-center mt-10">Tic Tac Toe</h1>
        <div class="buttons w-[80%] max-w-[300px] mx-auto my-10">
            <router-link :to="`/games/tictactoe/${roomId}`" class="a-btn-primary my-4">Start Game</router-link>
            <router-link to="/" class="a-btn-primary my-4">Join Game</router-link>
            <router-link to="/" class="a-btn-primary my-4">How to play</router-link>
        </div>
    </other-pages>
</template>

<script setup lang="ts">
    import { v4 as uuidv4 } from 'uuid';
import { onBeforeMount, ref } from 'vue';

    const roomId = ref()

    onBeforeMount(() => {
        roomId.value = uuidv4()
    })
</script>

<style scoped>
    
</style>
