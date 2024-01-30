<script setup lang="ts">
const url = ref('');

onLoad((option: any) => {
    url.value = decodeURIComponent(option.url);
});
</script>

<template>
    <web-view :src="url"></web-view>
</template>
