<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";

import { putAvatar, putSite } from "@/api/setter-api";
import { useSiteStore } from "@/stores/site";
import { useStateStore } from "@/stores/title";
import { getPublicFileUrl } from "@/utils";

const avatarRef = ref<HTMLImageElement>();

const siteStore = useSiteStore();
const stateStore = useStateStore();

const site = reactive(Object.assign({}, siteStore.site));
watchEffect(() => Object.assign(site, siteStore.site));

const avatarHttpRequest = (options: { file: File }) => {
  ElMessage.info("正在上传头像...");
  return putAvatar(options.file)
    .then(() => {
      ElMessage.success("头像上传成功。");
      avatarRef.value!.src = `${getPublicFileUrl(
        "avatar.png"
      )}?t=${Date.now()}`;
    })
    .catch(() => ElMessage.error("头像上传失败。"));
};

const onUpdateBtnClicked = () => {
  ElMessage.info("正在更新站点信息...");

  return putSite(site)
    .then(() => {
      siteStore.initSiteData(site);
      ElMessage.success("站点信息更新成功。");
    })
    .catch(() => {
      ElMessage.error("站点信息更新失败。");
    });
};

const onLogoutBtnClicked = () => {
  useLocalStorage("token", "").value = "";
  stateStore.token = "";
  window.location.reload();
};
</script>

<template>
  <div class="p-4 sm:p-8 pb-16 sm:pb-16 flex flex-col h-full">
    <div class="flex flex-row items-center mb-8">
      <i class="bi bi-house mr-2 text-xl"></i>
      <h1 class="text-2xl font-bold">站点设置</h1>
    </div>
    <div class="w-full sm:w-3/4 mx-auto">
      <div class="flex flex-col items-center text-sm mb-8">
        <div class="relative w-24 h-24 rounded-full overflow-hidden group mb-4">
          <img ref="avatarRef" :src="getPublicFileUrl('avatar.png')" alt="" />
          <el-upload
            class="absolute top-0 left-0 w-full h-full bg-black-mask text-white items-center justify-center hidden group-hover:flex cursor-pointer"
            :show-file-list="false"
            :http-request="avatarHttpRequest"
            accept="image/*"
          >
            <i class="bi bi-plus-lg text-5xl"></i>
          </el-upload>
        </div>
        <p>更换头像</p>
      </div>
      <el-form :model="site" label-width="60px">
        <el-form-item label="主标题">
          <el-input v-model="site.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="site.description" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="site.email" />
        </el-form-item>
        <el-form-item label="Github">
          <el-input v-model="site.github" />
        </el-form-item>
        <el-form-item label="Footer">
          <el-input v-model="site.footer" type="textarea" />
        </el-form-item>
      </el-form>
      <div
        class="btn-group flex flex-row justify-between sm:justify-end text-lg font-bold h-12 select-none"
      >
        <div
          class="mx-4 py-2 hover:border-b-2 border-b-black cursor-pointer"
          @click="onLogoutBtnClicked"
        >
          登出
        </div>
        <div
          class="mx-4 py-2 hover:border-b-2 border-b-black cursor-pointer"
          @click="onUpdateBtnClicked"
        >
          更新
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
