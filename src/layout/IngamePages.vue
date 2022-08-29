
<template>
    <div class="otherPages w-full">
        <IngameTopbar/>
        <div class="slotArea p-5 relative">
            <slot/>
        </div>
    </div>
</template>

<script setup lang="ts">
import IngameTopbar from '../components/IngameTopbar.vue';

</script>

<style scoped>

    
</style>
