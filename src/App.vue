
<template>
    <RouterView/>
    <Loader/>
    <Alert/>
    <IngameWidget/>
    <PromptModal/>
</template>

<script setup lang="ts">
    import IngameWidget from './components/IngameComps/IngameWidget.vue'
    import Loader from './components/Loader.vue'
    import Alert from './components/Notification/Alert.vue'
import PromptModal from './components/Notification/PromptModal.vue'
    
</script>

<style scoped>

</style>
