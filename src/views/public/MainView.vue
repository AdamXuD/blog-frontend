<script setup lang="ts">
import { useDark } from "@vueuse/core";

import { useSiteStore } from "@/stores/site";
import { useArticleStore } from "@/stores/articles";
import { getMetadata } from "@/api/getter-api";
import SearchBox from "@/components/SearchBox.vue";
import MenuGroup from "@/components/MenuGroup.vue";
import LoadingHint from "@/components/LoadingHint.vue";

const isDark = useDark();
const siteStore = useSiteStore();
const articleStore = useArticleStore();
const avatar = `${import.meta.env.VITE_BLOG_PUBLIC_PREFIX}avatar.png`;
const loading = ref(true);

const isSearchBoxShow = ref(false);

getMetadata().then((data) => {
  siteStore.initSiteData(data.site);
  articleStore.initArticleBriefList(data.articles);
  loading.value = false;
});
</script>

<template>
  <div class="bg-app text-primary dark:bg-dark-app dark:text-dark-primary">
    <div
      v-if="!loading"
      class="max-w-3xl min-h-screen mx-auto px-6 py-12 flex flex-col items-stretch"
    >
      <div class="header flex flex-col items-center mb-16 sm:mb-24">
        <div
          class="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-10"
        >
          <img :src="avatar" alt="" />
        </div>
        <h1 class="text-3xl mb-8 font-black text-center">
          <router-link to="/">
            {{ siteStore.site.title }}
          </router-link>
        </h1>
        <div
          class="flex flex-row justify-evenly text-regular dark:text-dark-regular w-64"
        >
          <router-link to="/" class="homepage" href="" title="主页">
            <i class="bi bi-house"></i>
          </router-link>
          <a
            class="toggle-dark cursor-pointer"
            title="夜间/正常模式"
            @click="isDark = !isDark"
          >
            <i class="bi" :class="isDark ? 'bi-sun' : 'bi-moon'"></i>
          </a>
          <a class="github" :href="siteStore.site.github" title="Github">
            <i class="bi bi-github"></i>
          </a>
          <a
            class="email"
            :href="`mailto:${siteStore.site.email}`"
            title="邮箱"
          >
            <i class="bi bi-envelope"></i>
          </a>
          <a class="search cursor-pointer" @click="isSearchBoxShow = true">
            <i class="bi bi-search" title="搜索"></i>
          </a>
        </div>
      </div>
      <div class="main flex-1 mb-16">
        <router-view />
      </div>
      <div
        class="footer flex flex-col items-center text-sm text-center text-secondary dark:text-dark-secondary"
        v-html="siteStore.site.footer"
      ></div>
    </div>
    <loading-hint
      class="w-screen h-screen"
      hint="Loading..."
      v-else
    ></loading-hint>
  </div>
  <search-box v-model="isSearchBoxShow"></search-box>
  <menu-group></menu-group>
</template>

<style scoped></style>
