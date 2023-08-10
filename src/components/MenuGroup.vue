<script setup lang="ts">
import { useRouter } from "vue-router";
import { useScroll } from "@vueuse/core";

import { useTOCStore } from "@/stores/toc";
import { useStateStore } from "@/stores/title";

const router = useRouter();
const tocStore = useTOCStore();
const stateStore = useStateStore();

const token = stateStore.token;
const isInArticlePage = computed(() => !!router.currentRoute.value.params.uuid);

const menuExpanded = ref(false);

const scrollToTop = () => {
  useScroll(window, {
    behavior: "smooth",
  }).y.value = 0;
};

const openAdminPage = () => {
  window.open("/admin/site", "_blank");
};

const editArticle = () => {
  window.open(
    `/admin/article/${router.currentRoute.value.params.uuid}`,
    "_blank"
  );
};

const showTOC = () => {
  tocStore.isTOCVisible = true;
};
</script>

<template>
  <div
    class="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 text-regular dark:text-dark-regular text-xl flex flex-col-reverse z-10"
  >
    <div
      class="button transition"
      :class="menuExpanded ? 'rotate-90' : ''"
      @click="menuExpanded = !menuExpanded"
    >
      <i class="bi bi-three-dots"></i>
    </div>
    <transition name="slide">
      <ul v-show="menuExpanded">
        <li class="button" @click="scrollToTop">
          <i class="bi bi-arrow-up"></i>
        </li>
        <li class="button" @click="openAdminPage">
          <i class="bi bi-gear"></i>
        </li>
        <li class="button" @click="editArticle" v-if="token && isInArticlePage">
          <i class="bi bi-pencil-square"></i>
        </li>
        <li class="button" @click="showTOC" v-if="isInArticlePage">
          <i class="bi bi-list-ul"></i>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.button {
  @apply w-12 h-12 flex items-center justify-center cursor-pointer rounded-full border-2 border-secondary bg-app dark:bg-dark-app dark:border-dark-secondary mt-2;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
