<script setup lang="ts">
import { useArticleStore } from "@/stores/articles";
import { useStateStore } from "@/stores/title";
import { timeFormat } from "@/utils";
import ErrorHint from "@/components/ErrorHint.vue";

const props = defineProps<{
  page: number;
}>();

const articlesStore = useArticleStore();
const titleStore = useStateStore();

const pageResult = computed(() => {
  return articlesStore.pagination({
    page: props.page,
    page_size: 10,
  });
});

watchEffect(() => (titleStore.subtitle = ""));
</script>

<template>
  <div v-if="pageResult.result.length">
    <div class="list-container flex flex-col items-center">
      <article v-for="item in pageResult.result" :key="item.uuid" class="mb-12">
        <router-link
          :to="`/article/${item.uuid}`"
          class="flex flex-col items-center"
        >
          <h2 class="title mb-3 text-2xl font-black text-center">
            {{ item.title }}
          </h2>
          <p class="time text-sm text-regular dark:text-dark-regular">
            {{ timeFormat(item.created_time) }}
          </p>
        </router-link>
      </article>
    </div>
    <div class="pagination flex flex-row items-center justify-evenly font-bold">
      <div v-if="page > 1">
        <router-link :to="`/page/${page - 1}`"> 上一页 </router-link>
      </div>
      <div v-if="page < pageResult.total_page">
        <router-link :to="`/page/${page + 1}`"> 下一页 </router-link>
      </div>
    </div>
  </div>
  <div v-else>
    <error-hint status="204" reason="文章列表为空。"></error-hint>
  </div>
</template>

<style scoped></style>
