<script setup lang="ts">
import { putInit } from "@/api/setter-api";
import { getAttachmentList, getMetadata } from "@/api/getter-api";
import { useAttachmentStore } from "@/stores/attachments";
import { useArticleStore } from "@/stores/articles";
import { useStateStore } from "@/stores/title";
import { useSiteStore } from "@/stores/site";
import { getPublicFileUrl } from "@/utils";

const route = useRoute();
const siteStore = useSiteStore();
const articleStore = useArticleStore();
const attachmentStore = useAttachmentStore();
const titleStore = useStateStore();

const getData = () => {
  let p1FailedCount = 0;
  const p1Generate: () => Promise<boolean> = () => {
    return getMetadata()
      .then((res) => {
        siteStore.initSiteData(res.site);
        articleStore.initArticleBriefList(res.articles);
        return true;
      })
      .catch(() => {
        if (p1FailedCount < 3) {
          p1FailedCount++;
          return p1Generate();
        }
        ElMessage.error("数据文件加载失败。");
        return false;
      });
  };

  let p2FailedCount = 0;
  const p2Generate: () => Promise<boolean> = () => {
    return getAttachmentList()
      .then((res) => {
        attachmentStore.initAttachmentList(res);
        return true;
      })
      .catch(() => {
        if (p2FailedCount < 3) {
          p2FailedCount++;
          return p2Generate();
        }
        ElMessage.error("附件列表加载失败。");
        return false;
      });
  };
  return Promise.all([p1Generate(), p2Generate()]);
};

const loading = ref(true);

getData().then(([res1, res2]) => {
  loading.value = false;
  if (!res1 && !res2) {
    ElMessageBox.confirm("数据文件加载失败，是否尝试初始化？", "提示", {
      confirmButtonText: "初始化",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => putInit())
      .finally(() => location.reload());
  }
});

watchEffect(() => (titleStore.subtitle = String(route.meta.title)));
</script>

<template>
  <div v-loading="loading" class="flex flex-col items-stretch h-screen">
    <div
      class="header h-16 bg-dark-app text-dark-primary flex flex-row justify-center sm:justify-between items-center sm:px-6"
    >
      <div class="brand flex-row items-center flex">
        <div
          class="w-10 h-10 rounded-full overflow-hidden mr-2 sm:mr-4 sm:w-12 sm:h-12"
        >
          <img :src="getPublicFileUrl('avatar.png')" alt="" />
        </div>
        <h1 class="font-black text-xl sm:block hidden">
          {{ siteStore.site.title }}
        </h1>
      </div>
      <ul class="flex flex-row items-center h-full">
        <li class="h-full">
          <router-link
            to="/admin/site"
            class="flex flex-row items-center h-full px-2 sm:px-4 hover:bg-white-mask hover:text-primary"
          >
            <i class="bi bi-house mr-2"></i>
            站点
          </router-link>
        </li>
        <li class="h-full">
          <router-link
            to="/admin/article"
            class="flex flex-row items-center h-full px-2 sm:px-4 hover:bg-white-mask hover:text-primary"
          >
            <i class="bi bi-file-earmark-text mr-2"></i>
            文章
          </router-link>
        </li>
        <li class="h-full">
          <router-link
            to="/admin/attachment"
            class="flex flex-row items-center h-full px-2 sm:px-4 hover:bg-white-mask hover:text-primary"
          >
            <i class="bi bi-archive mr-2"></i>
            附件
          </router-link>
        </li>
      </ul>
      <ul class="flex-row items-center h-full flex">
        <li class="h-full">
          <a
            href="/"
            target="_blank"
            class="flex flex-row items-center h-full px-2 sm:px-4 hover:bg-white-mask hover:text-primary"
          >
            <i class="bi bi-link mr-2"></i>
            主页
          </a>
        </li>
      </ul>
    </div>
    <div class="flex flex-col flex-1 h-0 max-w-4xl mx-auto w-full">
      <router-view v-if="!loading" />
    </div>
  </div>
</template>

<style scoped></style>
