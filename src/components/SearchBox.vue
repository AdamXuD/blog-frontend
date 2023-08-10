<script setup lang="ts">
import { watchThrottled } from "@vueuse/core";

import { useArticleStore } from "@/stores/articles";
import type { Article } from "@/types";

const props = defineProps<{
  modelValue: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const searchInput = ref<{ focus: () => void } | null>(null);

const articleStore = useArticleStore();
const keyword = ref("");
const searchResult = ref<
  {
    article: Article;
    matchedParagraph: string;
  }[]
>([]);

watchThrottled(
  keyword,
  async () => (searchResult.value = await articleStore.search(keyword.value)),
  { throttle: 1000 }
);

onUpdated(() => {
  if (!props.modelValue) return;
  nextTick(() => searchInput.value?.focus());
});
</script>

<template>
  <div v-if="modelValue" @keyup.esc="$emit('update:modelValue', false)">
    <div
      class="w-screen h-screen fixed top-0 left-0 bg-white dark:bg-black opacity-80 z-10"
      @click="$emit('update:modelValue', false)"
    ></div>
    <div
      class="flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5/6 sm:w-1/2 h-2/3 z-20 bg-app dark:bg-dark-app rounded shadow-2xl p-4 text-primary dark:text-dark-primary"
    >
      <div class="pb-4 border-b border-secondary dark:border-dark-secondary">
        <div
          class="flex flex-row text-xl px-4 py-2 border border-secondary dark:border-dark-secondary rounded-lg focus-within:border-dark-app dark:focus-within:border-app text-primary dark:text-dark-primary"
        >
          <div class="mr-4">
            <i class="bi bi-search" title="搜索"></i>
          </div>
          <input
            type="text"
            v-model="keyword"
            class="bg-transparent outline-none border-none"
            placeholder="请输入关键词..."
            ref="searchInput"
          />
        </div>
      </div>
      <ul class="flex-1 overflow-y-auto scroll" v-if="searchResult.length > 0">
        <li v-for="item in searchResult" :key="item.article.uuid">
          <router-link
            @click="$emit('update:modelValue', false)"
            :to="`/article/${item.article.uuid}`"
            class="block py-4 px-4 border-b border-secondary border-opacity-60 dark:border-dark-secondary"
          >
            <h1 class="font-bold text-xl mb-2">
              {{ item.article.title }}
            </h1>
            <p
              class="text-regular dark:text-dark-regular line-clamp-2 sm:line-clamp-3"
            >
              {{ item.matchedParagraph }}
            </p>
          </router-link>
        </li>
      </ul>
      <div v-else class="flex-1 flex items-center justify-center">
        <p class="text-regular dark:text-dark-regular">
          没有找到与“{{ keyword }}”相关的文章
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
