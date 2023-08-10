<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    status?: string;
    reason?: string;
  }>(),
  {
    status: "404",
    reason: "前面的区域以后再来探索吧。",
  }
);
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="py-8 text-3xl font-black text-regular">{{ props.status }}</h1>
    <p class="mb-4">{{ props.reason }}</p>
  </div>
</template>

<style scoped></style>
