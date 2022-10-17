
<template>
    <div class="topbar text-white px-3 py-5 flex items-center justify-between">
        <router-link to="/" class="text-blue font-bold text-lg tracking-widest cursor-pointer">GAME CENTER.</router-link>
        
        <button class="btn-white" @click="startShare">Share</button>
    </div>
</template>

<script setup lang="ts">
	import { useShare } from '@vueuse/core'

	const { share, isSupported } = useShare()

	function startShare() {
		share({
			url: location.href,
		})
	}
</script>

<style scoped>

</style>
