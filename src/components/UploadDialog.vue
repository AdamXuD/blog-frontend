<script setup lang="ts">
import {
  type UploadFile,
  type UploadFiles,
  ElUpload,
  type UploadRequestOptions,
} from "element-plus";

import { postAttachment } from "@/api/setter-api";
import { useArticleStore } from "@/stores/articles";
import { useAttachmentStore } from "@/stores/attachments";
import { getTimestamp } from "@/utils";

defineProps<{
  modelValue: boolean;
}>();

const emits = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const uploadRef = ref<InstanceType<typeof ElUpload>>();

const articleStore = useArticleStore();
const attachmentStore = useAttachmentStore();

const articleSelectKeyword = ref("");

const articleSelectList = computed(() => {
  return articleStore.articleBriefList
    .filter((item) => {
      if (articleSelectKeyword.value === "") return true;
      return (
        item.title
          .toLowerCase()
          .indexOf(articleSelectKeyword.value.toLowerCase()) > -1
      );
    })
    .map((article) => ({
      label: article.title,
      value: article.uuid,
    }));
});

const articleSelectFilterMethod = (query: string) => {
  articleSelectKeyword.value = query;
};

const articleUuid = ref<string>();

const fileHttpRequest = (options: UploadRequestOptions) => {
  return postAttachment(
    articleUuid.value || "",
    options.file.name,
    options.file
  )
    .then(() => {
      ElMessage.success(`文件${options.file.name}上传完成。`);
    })
    .catch(() => {
      ElMessage.error(`文件${options.file.name}上传失败。`);
    });
};

const onFileUploadSuccess = (
  response: unknown,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  attachmentStore.insertAttachment({
    filename: uploadFile.name,
    article_uuid: articleUuid.value || "",
    size: uploadFile.size || 0,
    uploaded_time: getTimestamp(),
  });
  ElMessage.success(`文件${uploadFile.name}上传完成。`);
  if (uploadFiles.indexOf(uploadFile) === uploadFiles.length - 1) {
    ElMessage.success("所有文件上传完成。");
  }
};

const onFileUploadFailed = (response: unknown, uploadFile: UploadFile) => {
  ElMessage.error(`文件${uploadFile.name}上传失败。`);
};

const onAttachmentDialogUploadBtnClicked = () => {
  ElMessage.info("正在上传文件...");
  uploadRef.value?.submit();
  emits("update:modelValue", false);
};
</script>

<template>
  <el-dialog
    :modelValue="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="75%"
  >
    <el-select
      v-model="articleUuid"
      placeholder="归属文章"
      class="mb-2"
      filterable
      :filter-method="articleSelectFilterMethod"
    >
      <el-option
        v-for="item in articleSelectList"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </el-option>
    </el-select>
    <el-upload
      ref="uploadRef"
      drag
      multiple
      :auto-upload="false"
      :http-request="fileHttpRequest"
      :on-success="onFileUploadSuccess"
      :on-error="onFileUploadFailed"
    >
      <div class="mb-2">
        <i class="bi bi-upload text-4xl"></i>
      </div>
      将文件拖放到此或点击上传
    </el-upload>
    <template #footer>
      <div
        class="btn-group flex flex-row justify-end text-lg font-bold h-12 select-none"
      >
        <div
          class="mx-4 py-2 hover:border-b-2 border-b-black cursor-pointer"
          @click="onAttachmentDialogUploadBtnClicked"
        >
          上传
        </div>
        <div
          class="mx-4 py-2 hover:border-b-2 border-b-black cursor-pointer"
          @click="$emit('update:modelValue', false)"
        >
          关闭
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
