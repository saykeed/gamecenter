
<template>
    <div class="topbar text-white px-3 py-5 flex items-center justify-between">
        <router-link to="/" class="text-blue font-bold text-lg tracking-widest cursor-pointer">GAME CENTER.</router-link>
        <div class="flex items-center justify-center md:hidden w-[40px] h-[40px] rounded-full bg-white text-primary border-2 border-primary cursor-pointer">
            <i class="material-icons text-lg">menu</i>
            <!-- <i class="material-icons text-lg">close</i> -->
        </div>
        <div class="flex hidden md:flex">
            <button class="btn-white mr-3">Sign in</button>
            <button class="btn-primary" >Create Account</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    
</script>

<style scoped>

</style>
