<script setup lang="ts">
import { useEventListener, useThrottleFn } from "@vueuse/core";

import { useArticleStore } from "@/stores/articles";
import { timeFormat, isElemInView } from "@/utils";
import { renderArticle } from "@/utils/render";
import type { Article, ArticleBrief } from "@/types";
import ErrorHint from "@/components/ErrorHint.vue";
import ArticleToc from "@/components/ArticleToc.vue";
import LoadingHint from "@/components/LoadingHint.vue";
import { useTOCStore } from "@/stores/toc";
import { useStateStore } from "@/stores/title";

const props = defineProps<{
  uuid: string;
}>();

const articlesStore = useArticleStore();
const titleStore = useStateStore();
const tocStore = useTOCStore();

const isArticleExist = computed(() => {
  return articlesStore.isArticleExist(props.uuid);
});
const articleDetail = ref<
  Article & {
    next?: ArticleBrief;
    prev?: ArticleBrief;
  }
>();

watchEffect(() => {
  articleDetail.value = undefined;
  if (!isArticleExist.value) {
    titleStore.subtitle = "404喵~";
    return;
  }
  titleStore.subtitle = "加载中...";
  articlesStore
    .getArticleDetail(props.uuid)
    .then((article) => {
      articleDetail.value = {
        ...article,
        ...articlesStore.getArticleNeighbor(props.uuid),
      };
      titleStore.subtitle = articleDetail.value.title;
    })
    .catch(() => {
      titleStore.subtitle = "404喵~";
    });
});

const vRenderArticle = {
  mounted: (el: HTMLElement, binding: { value: string }) => {
    renderArticle(el, binding.value);
  },
};

const headerElems: Element[] = [];
const vToc = {
  updated: (el: HTMLElement) => {
    headerElems.splice(0, headerElems.length);
    headerElems.push(...el.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    tocStore.generateTOC(el);
  },
};

const getActiveTOCThrottled = useThrottleFn(() => {
  const elemsInView = headerElems.filter((elem) =>
    isElemInView(elem as HTMLElement)
  );
  if (elemsInView.length !== 0) {
    tocStore.setActiveTOC(elemsInView[0].id);
  }
}, 100);

useEventListener("scroll", getActiveTOCThrottled);
</script>

<template>
  <div v-if="isArticleExist && articleDetail">
    <div class="article-container flex flex-col items-scretch mb-10">
      <div class="title-area flex flex-col items-center mb-6">
        <h1 class="title text-2xl mb-4 font-black text-center">
          {{ articleDetail.title }}
        </h1>
        <p class="time text-sm text-regular dark:text-dark-regular">
          {{ timeFormat(articleDetail.created_time) }} / AdamXuD
        </p>
      </div>
      <div
        class="max-w-full break-words"
        ref="articleContent"
        :class="[
          'prose',
          'prose-lg',
          'dark:prose-invert',
          'prose-pre:scroll',
          'prose-img:m-0',
        ]"
        v-render-article="articleDetail.content"
        v-toc
      ></div>
    </div>
    <div class="flex flex-row justify-evenly">
      <div class="flex flex-col items-center w-1/2" v-if="articleDetail.prev">
        <div class="py-6">上一篇</div>
        <router-link
          :to="`/article/${articleDetail.prev.uuid}`"
          class="text-2xl font-bold text-center flex-1"
        >
          <h2>
            {{ articleDetail.prev.title }}
          </h2>
        </router-link>
      </div>
      <div class="flex flex-col items-center w-1/2" v-if="articleDetail.next">
        <div class="py-6">下一篇</div>
        <router-link
          :to="`/article/${articleDetail.next.uuid}`"
          class="text-2xl font-bold text-center"
        >
          <h2>
            {{ articleDetail.next.title }}
          </h2>
        </router-link>
      </div>
    </div>
    <article-toc></article-toc>
  </div>
  <div v-else-if="isArticleExist">
    <div class="w-full flex flex-col items-center justify-center">
      <loading-hint></loading-hint>
    </div>
  </div>
  <div v-else>
    <error-hint status="404" reason="文章不存在。"></error-hint>
  </div>
</template>

<style scoped></style>
