<script setup lang="ts">
import { useEventListener } from "@vueuse/core";

import {
  getTimestamp,
  timeFormat,
  generateUUID,
  generateFilename,
  getPublicFileUrl,
} from "@/utils";
import {
  postArticle,
  putArticle,
  putArticleStage,
  postAttachment,
} from "@/api/setter-api";
import {
  getArticleBackupData,
  getArticleData,
  getArticleStageData,
} from "@/api/getter-api";
import { useAttachmentStore } from "@/stores/attachments";
import { useArticleStore } from "@/stores/articles";
import type { Article } from "@/types";

const props = defineProps<{
  uuid: string;
  mode: "edit" | "new";
}>();

const editorRef = ref<{
  $img2Url: (pos: number, url: string) => void;
}>();

const router = useRouter();
const attachmentStore = useAttachmentStore();
const articleStore = useArticleStore();

const data = reactive({
  current: undefined as Article | undefined,
  backup: undefined as Article | undefined,
  stage: undefined as Article | undefined,
});
const dataType = ref<"current" | "backup" | "stage">("current");
const article = computed(() => data[dataType.value]);

const loading = ref(true);

const saved = ref(true);
const onSomethingChanged = () => (saved.value = false);

const getData = () => {
  if (props.mode === "new") {
    const time = getTimestamp();
    const current = Promise.resolve<Article>({
      uuid: "",
      title: "",
      content: "",
      created_time: time,
      updated_time: time,
    });
    const backup = Promise.resolve(undefined);
    const stage = Promise.resolve(undefined);
    return Promise.all([current, backup, stage]);
  } else {
    const current = getArticleData(props.uuid).catch(() => undefined);
    const backup = getArticleBackupData(props.uuid).catch(() => undefined);
    const stage = getArticleStageData(props.uuid).catch(() => undefined);
    return Promise.all([current, backup, stage]);
  }
};

watchEffect(() => {
  getData().then(([current, backup, stage]) => {
    loading.value = false;
    data.current = current;
    data.backup = backup;
    data.stage = stage;
    if (!current) {
      ElMessage.error("文章不存在。");
      router.push({ path: "/article" });
    }
    if (stage) {
      dataType.value = "stage";
      ElMessage.success("暂存文章已加载。");
    }
    nextTick(() => (saved.value = true));
  });
});

const fileList = reactive<
  {
    position: string;
    file: File;
  }[]
>([]);
const onImgAdd = (position: number, file: File) => {
  fileList.push({ position: position.toString(), file });
};
const onImgDelete = (position: number) => {
  fileList.splice(
    fileList.findIndex((item) => item.position === position.toString()),
    1
  );
};

const onPublishBtnClicked = async () => {
  if (article.value === undefined) return;
  if (article.value.title === "" || article.value.content === "") {
    ElMessage.error("标题或内容不能为空。");
    return;
  }

  ElMessage.info("正在保存文章...");

  if (props.mode === "new") {
    article.value.uuid = generateUUID();
  } else {
    article.value.updated_time = getTimestamp();
  }

  Promise.allSettled(
    fileList.map((item) => {
      const oldFilename = item.file.name;
      const newFilename = generateFilename(item.file.name);
      return postAttachment(article.value?.uuid || "", newFilename, item.file)
        .then(() => {
          attachmentStore.insertAttachment({
            filename: newFilename,
            article_uuid: article.value?.uuid || "",
            size: item.file.size,
            uploaded_time: getTimestamp(),
          });
          editorRef.value?.$img2Url(
            parseInt(item.position || "0"),
            getPublicFileUrl(`attachments/${newFilename}`) || ""
          );
          ElMessage.success(`附件 ${oldFilename} 上传成功。`);
        })
        .catch(() => {
          ElMessage.error(`附件 ${oldFilename} 上传失败。`);
        });
    })
  ).then(() => {
    if (!article.value) return;
    if (props.mode === "new") {
      postArticle(article.value)
        .then(() => {
          article.value && articleStore.insertArticle(article.value);
          saved.value = true;
          ElMessage.success("文章保存成功。");
          router.push({ path: "/admin/article" });
        })
        .catch(() => ElMessage.error("文章保存失败。"));
    } else {
      putArticle(article.value)
        .then(() => {
          article.value && articleStore.updateArticle(article.value);
          saved.value = true;
          ElMessage.success("文章保存成功。");
          router.push({ path: "/admin/article" });
        })
        .catch(() => ElMessage.error("文章保存失败。"));
    }
  });
};

const onStagingBtnClicked = async () => {
  if (article.value === undefined) return;
  if (article.value.title === "" || article.value.content === "") {
    ElMessage.error("标题或内容不能为空。");
    return;
  }
  if (props.mode === "new") {
    ElMessage.error("新建文章无法暂存。");
    return;
  }

  ElMessage.info("正在暂存文章...");

  Promise.allSettled(
    fileList.map((item) => {
      const oldFilename = item.file.name;
      const newFilename = generateFilename(oldFilename);
      return postAttachment(article.value?.uuid || "", newFilename, item.file)
        .then(() => {
          attachmentStore.insertAttachment({
            filename: newFilename,
            article_uuid: article.value?.uuid || "",
            size: item.file.size,
            uploaded_time: getTimestamp(),
          });
          editorRef.value?.$img2Url(
            parseInt(item.position || "0"),
            getPublicFileUrl(`attachments/${newFilename}`) || ""
          );
          ElMessage.success(`附件 ${oldFilename} 上传成功。`);
        })
        .catch(() => {
          ElMessage.error(`附件 ${oldFilename} 上传失败。`);
        });
    })
  ).then(() => {
    if (!article.value) return;
    putArticleStage(article.value)
      .then(() => {
        saved.value = true;
        ElMessage.success("文章暂存成功。");
        router.push({ path: "/admin/article" });
      })
      .catch(() => ElMessage.error("文章暂存失败。"));
  });
};

const onCancelBtnClicked = () => {
  router.go(-1);
};

const onDataTypeChanged = (type: "current" | "backup" | "stage") => {
  if (dataType.value === type) return;
  if (!data[type]) {
    ElMessage.error("当前文章暂无相应记录。");
    return;
  }
  onSomethingChanged();
  dataType.value = type;
};

onBeforeRouteLeave((to, from, next) => {
  if (saved.value) {
    next();
    return;
  }
  ElMessageBox.confirm("确定离开当前页面？您所作修改将不会被保存。", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => next())
    .catch(() => {});
});

useEventListener("beforeunload", (e: BeforeUnloadEvent) => {
  if (saved.value) return;
  e.preventDefault();
  e.returnValue = "";
});
</script>

<template>
  <div v-loading="loading" class="p-4 sm:p-8 pb-16 sm:pb-16 h-full">
    <div v-if="article" class="flex flex-col h-full">
      <div class="flex flex-row items-center justify-between mb-8">
        <div class="flex flex-row items-center">
          <i class="bi bi-file-earmark-text mr-2 text-xl"></i>
          <h1 class="text-2xl font-bold">文章编辑</h1>
        </div>
        <div class="flex flex-row h-8 select-none">
          <div
            class="mx-2 hover:border-b-2 cursor-pointer border-b-black"
            :class="dataType === 'current' ? 'border-b-2 border-b-black' : ''"
            @click="onDataTypeChanged('current')"
          >
            当前
          </div>
          <div
            class="mx-2 hover:border-b-2 cursor-pointer border-b-black"
            :class="dataType === 'stage' ? 'border-b-2 border-b-black' : ''"
            @click="onDataTypeChanged('stage')"
          >
            暂存
          </div>
          <div
            class="mx-2 hover:border-b-2 cursor-pointer border-b-black"
            :class="dataType === 'backup' ? 'border-b-2 border-b-black' : ''"
            @click="onDataTypeChanged('backup')"
          >
            历史
          </div>
        </div>
      </div>
      <p class="text-sm mb-4">正在编辑文章UUID：{{ article.uuid }}</p>
      <div class="flex flex-row items-center mb-4">
        <p class="whitespace-nowrap">标题：</p>
        <el-input
          v-model="article.title"
          @input="onSomethingChanged"
        ></el-input>
      </div>
      <mavon-editor
        v-model="article.content"
        ref="editorRef"
        @imgAdd="onImgAdd"
        @imgDel="onImgDelete"
        @change="onSomethingChanged"
        class="w-full mb-4 flex-1"
      />

      <div class="flex flex-row">
        <div class="text-sm w-1/2">
          <p>创建时间：{{ timeFormat(article.created_time) }}</p>
          <p>最近更新时间：{{ timeFormat(article.updated_time) }}</p>
        </div>
        <div
          class="btn-group flex flex-row justify-end w-1/2 text-lg font-bold h-12 select-none"
        >
          <div
            class="mx-2 md:mx-4 py-2 hover:border-b-2 border-b-black cursor-pointer"
            @click="onPublishBtnClicked"
          >
            发布
          </div>
          <div
            class="mx-2 md:mx-4 py-2 hover:border-b-2 border-b-black cursor-pointer"
            @click="onStagingBtnClicked"
          >
            暂存
          </div>
          <div
            class="mx-2 md:mx-4 py-2 hover:border-b-2 border-b-black cursor-pointer"
            @click="onCancelBtnClicked"
          >
            取消
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
