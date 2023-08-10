<script setup lang="ts">
import { useTitle } from "@vueuse/core";

import { useSiteStore } from "@/stores/site";
import { useStateStore } from "./stores/title";

const siteStore = useSiteStore();
const titleStore = useStateStore();

watchEffect(() => {
  if (titleStore.subtitle) {
    useTitle(`${titleStore.subtitle} | ${siteStore.site.title}`);
  } else {
    useTitle(`${siteStore.site.title}`);
  }
});
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
