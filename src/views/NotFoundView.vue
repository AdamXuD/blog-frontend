<script setup lang="ts">
import NotFound from "@/components/ErrorHint.vue";
import { useStateStore } from "@/stores/title";

const titleStore = useStateStore();
const router = useRouter();

watchEffect(() => (titleStore.subtitle = "404喵~"));

const goBack = () => router.go(-1);
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <not-found></not-found>
    <div
      class="mt-2 flex flex-row items-center justify-evenly font-bold text-xl cursor-pointer"
      @click="goBack"
    >
      返回上一页
    </div>
  </div>
</template>

<style scoped></style>
