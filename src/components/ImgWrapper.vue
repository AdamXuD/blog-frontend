<script setup lang="ts">
defineProps<{
  src: string;
  previewSrcList: string[];
  initialIndex: number;
}>();
</script>

<template>
  <el-image
    :src="src"
    fit="cover"
    loading="lazy"
    :preview-src-list="previewSrcList"
    :initial-index="initialIndex"
    class="block w-4/5 sm:w-1/2 mx-auto rounded my-6"
  >
    <template #error>
      <div
        class="w-full h-64 rounded flex flex-col items-center justify-center border border-regular dark:border-dark-regular text-regular dark:text-dark-regular"
      >
        <i class="bi bi-x-lg text-4xl"></i>
        <span class="my-8 text-sm">图片加载失败</span>
      </div>
    </template>
    <template #placeholder>
      <div
        class="w-full h-64 rounded flex flex-col items-center justify-center border border-regular dark:border-dark-regular text-regular dark:text-dark-regular"
      ></div>
    </template>
  </el-image>
</template>

<style scoped></style>
