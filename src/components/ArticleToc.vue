<script setup lang="ts">
import { useEventListener, useTimeoutFn } from "@vueuse/core";

import { useTOCStore } from "@/stores/toc";

const tocStore = useTOCStore();
const refTOCList = ref<HTMLElement | null>(null);

useEventListener("scroll", () => {
  if (!refTOCList.value) return;
  refTOCList.value.querySelector("li.active-toc")?.scrollIntoView();
});

const onTOCItemClicked = (item: { scrollIntoView: () => void }) => {
  useTimeoutFn(() => item.scrollIntoView(), 300);
  tocStore.isTOCVisible = false;
};
</script>

<template>
  <transition name="faded">
    <div
      class="fixed w-screen h-screen top-0 left-0 bg-white-mask dark:bg-black-mask z-20 flex items-stretch"
      v-show="tocStore.isTOCVisible"
    >
      <transition name="slide">
        <div
          class="w-2/3 sm:w-1/2 md:w-1/3 h-full p-4 flex flex-col items-stretch bg-app dark:bg-dark-app text-primary dark:text-dark-primary shadow-2xl"
          v-show="tocStore.isTOCVisible"
        >
          <h1 class="text-xl mb-4 flex items-center justify-between">
            <span class="font-bold">Table Of Content</span>
            <div class="cursor-pointer" @click="tocStore.isTOCVisible = false">
              <i class="bi bi-x text-3xl"></i>
            </div>
          </h1>
          <ul
            class="flex-1 overflow-y-auto scroll text-xl"
            ref="refTOCList"
            v-if="tocStore.TOCList.length"
          >
            <li
              v-for="item in tocStore.TOCList"
              :key="item.anchor"
              :style="{ 'padding-left': `${0.5 * item.level}rem` }"
              class="py-0.5 pr-4 truncate border-l-2"
              :class="
                item.anchor === tocStore.activeTOCId
                  ? 'border-secondary dark:border-dark-secondary active-toc'
                  : 'border-transparent'
              "
            >
              <span class="cursor-pointer" @click="onTOCItemClicked(item)">
                {{ item.title }}
              </span>
            </li>
          </ul>
          <div class="flex-1 flex items-center justify-center" v-else>
            <p class="text-sm text-secondary dark:text-dark-secondary">Blank</p>
          </div>
        </div>
      </transition>
      <div class="flex-1" @click="tocStore.isTOCVisible = false"></div>
    </div>
  </transition>
</template>

<style scoped>
.faded-enter-active,
.faded-leave-active,
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}

.faded-enter-from,
.faded-leave-to {
  opacity: 0;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
