
<template>
    <ingame-pages >
        <h1 class="text-white text-3xl sm:text-5xl font-bold text-center mt-10">Tic Tac Toe</h1>
        <div class="gameBox w-full max-w-[400px] mx-auto">
            <p v-if="gameStatus" class="turn bg-primary text-white text-center my-5 rounded-full py-1 px-4 mx-auto w-fit">{{myTurn ? `Your turn to play ${mySymbol}` : 'Opponent turn to play'}}</p>
            <p v-else class="waiting text-xl text-white text-center font-semibold my-5" >Waiting for another player to join</p>
            <p v-if="rematch" class="text-center text-2xl text-white font-bold my-5">{{rematchDesc}}</p>
            <div class="tictactoe-board">

                <div class="tileWrap  w-fit grid grid-cols-3 grid-rows-3 gap-2 mx-auto my-5">
                    <button v-for="(tile, index) in board" :key="index"
                        class="bg-primary w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] w-fit rounded disabled:cursor-not-allowed flex items-center justify-center text-4xl font-bold text-white hover:border-2 hover:bg-background hover:border-slate-100"
                        :disabled="ifDisabled(index)" @click="playerClicked(index)"
                    >
                        {{tile}}
                    </button>
                </div>

                <button v-if="rematch" class="btn-primary">Play Again {{rematch}}</button>
            </div>
        </div>
        <IngameWidget v-if="gameStatus"/>
    </ingame-pages>
    <keep-alive>
        <IngameChatBox/>
    </keep-alive>
    <VideoCall v-if="videoCallStatus"/>
</template>

<script setup lang="ts">
    import { onMounted, } from 'vue';
    import { useHandleConnection } from '../../../composables/tictactoe/HandleConnection';
    import { useRoute } from 'vue-router';
    import { useTicGameHandler } from '../../../composables/tictactoe/HandleTicGame'
    import IngameWidget from '../../../components/IngameComps/IngameWidget.vue'
    import IngameChatBox from '../../../components/IngameComps/IngameChatBox.vue';
    import VideoCall from '../../../components/VideoCall.vue';
    import { useVideoChat } from '../../../composables/tictactoe/HandleVideoChat';

    const route = useRoute()
    const { makeConnection } = useHandleConnection()
    const { videoCallStatus } =  useVideoChat()
    const { board, tileClicked, ifDisabled, gameStatus, myTurn, rematch, rematchDesc, mySymbol } =  useTicGameHandler()


   onMounted(() => {
        makeConnection(route.params.id)
   })
    
    

    // full room event for use later
    // socket.on('fullRoom', () => {
    //     alert('room is full')
    // })

    

    const playerClicked = (index:number) => {
        tileClicked(index)
    }

        
</script>

<style scoped>
    
</style>
