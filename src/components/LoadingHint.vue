<script lang="ts" setup>
defineProps<{
  hint?: string;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div
      class="w-16 h-16 border-4 border-app dark:border-dark-app border-l-regular dark:border-l-dark-regular rounded-full animate-spin mb-8"
    ></div>
    <p class="text-xl" v-if="hint">{{ hint }}</p>
  </div>
</template>

<style scoped></style>
