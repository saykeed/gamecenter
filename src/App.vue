
<template>
    <RouterView/>
    <Loader/>
    <Alert/>
    <!-- <IngameWidget/> -->
    <PromptModal/>
    <!-- <div class="videoWrapper"></div>
    <video id="videoEl" class="myVideo border-2 border-red-600 w-[300px] h-[300px] mx-auto"  src="" autoplay></video> -->

    <!-- http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4 -->
</template>

<script setup lang="ts">
    import { onMounted, watch } from 'vue'
import IngameWidget from './components/IngameComps/IngameWidget.vue'
    import Loader from './components/Loader.vue'
    import Alert from './components/Notification/Alert.vue'
    import PromptModal from './components/Notification/PromptModal.vue'
    
    import { useVideoChat } from './composables/tictactoe/HandleVideoChat'

    const { stream } = useVideoChat()

    // watch(stream, (newMsg) => {
    //         // let el:any = document.querySelector('.videoWrapper')
    //         // el+= `<video></video>`

    //         let el:any = document.querySelector('#videoEl')
    //         el.srcObject = stream.value;
    //         // console.log(el, stream)
    // })
    
    onMounted(() => {
        // setTimeout(() => {
        //     let el:any = document.querySelector('.myVideo')
        //     el.play()
        // }, 3000);
        

        // navigator.mediaDevices.getUserMedia({ 'video': true, 'audio': true})
        // .then(stream => {
        //     console.log('Got MediaStream:', stream);
        //     let el:any = document.querySelector('#videoEl')
        //     el.srcObject = stream;
        // })
        // .catch(error => {
        //     console.error('Error accessing media devices.', error);
        // });
		
    })
    
</script>

<style scoped>

</style>
