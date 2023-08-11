<script setup lang="ts">
import { useAttachmentStore } from "@/stores/attachments";
import { timeFormat, sizeFormat } from "@/utils";
import type { Attachment } from "@/types";
import { getPublicFileUrl } from "@/utils";
import UploadDialog from "@/components/UploadDialog.vue";
import { deleteAttachment } from "@/api/setter-api";

const sortMethodList = [
  {
    label: "时间升序",
    value: "upload_time_asc",
  },
  {
    label: "时间降序",
    value: "upload_time_desc",
  },

  {
    label: "大小升序",
    value: "size_asc",
  },
  {
    label: "大小降序",
    value: "size_desc",
  },
];

const attachmentStore = useAttachmentStore();

const page = ref(1);
const filter = reactive({
  article_uuid: "",
  sort_method: "",
  filename: "",
});
const data = computed(() => {
  return attachmentStore.filter({
    page: page.value,
    page_size: 10,
    article_uuid: filter.article_uuid,
    sort_method: filter.sort_method,
    filename: filter.filename,
  });
});
watch(filter, () => (page.value = 1));

const isUploadAttachmentDialogVisible = ref(false);

const onDeleteAttachmentBtnClicked = (attachments: Attachment[]) => {
  if (attachments.length === 0) {
    ElMessage.error("请选择附件。");
    return;
  }
  ElMessageBox.confirm("确定要删除这些附件吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage.info("正在删除附件...");

      const attachmentFilenames = attachments.map(
        (attachment) => attachment.filename
      );
      deleteAttachment(attachmentFilenames)
        .then(() => {
          attachmentFilenames.forEach((filename) =>
            attachmentStore.deleteAttachment(filename)
          );
          ElMessage.success(`附件删除成功。`);
        })
        .catch(() => {
          ElMessage.error(`附件删除失败。`);
        });
    })
    .catch(() => {});
};

const selectionData = ref<Attachment[]>([]);
const onSelectionChange = (selection: Attachment[]) => {
  selectionData.value = selection;
};
</script>

<template>
  <div class="p-4 sm:p-8 pb-16 sm:pb-16 h-full flex flex-col">
    <div class="flex flex-row items-center mb-8">
      <i class="bi bi-archive mr-2 text-xl"></i>
      <h1 class="text-2xl font-bold">附件设置</h1>
    </div>
    <div
      class="flex flex-col sm:flex-row justify-between items-center text-lg font-bold mb-4 select-none"
    >
      <div class="btn-group flex flex-row h-12">
        <div
          class="mx-4 py-2 hover:border-b-2 cursor-pointer border-b-black whitespace-nowrap"
          @click="isUploadAttachmentDialogVisible = true"
        >
          <i class="bi bi-upload mr-2"></i>
          上传附件
        </div>
        <div
          class="mx-4 py-2 hover:border-b-2 cursor-pointer border-b-black whitespace-nowrap"
          @click="onDeleteAttachmentBtnClicked(selectionData)"
        >
          <i class="bi bi-file-x mr-2"></i>
          删除附件
        </div>
      </div>
      <div class="pagination flex flex-row h-12" v-if="data.total_page > 1">
        <div
          v-if="page > 1"
          class="mx-4 py-2 hover:border-b-2 cursor-pointer border-b-black whitespace-nowrap"
          @click="page--"
        >
          <i class="bi bi-arrow-left mr-2"></i>
          上一页
        </div>
        <div
          v-if="page < data.total_page"
          class="mx-4 py-2 hover:border-b-2 cursor-pointer border-b-black whitespace-nowrap"
          @click="page++"
        >
          下一页
          <i class="bi bi-arrow-right mr-2"></i>
        </div>
      </div>
    </div>
    <div class="filter flex flex-row items-center mb-4">
      <el-input
        v-model="filter.article_uuid"
        placeholder="文章ID"
        class="flex-1 mr-4"
      />
      <el-select
        v-model="filter.sort_method"
        placeholder="排序方式"
        class="flex-1 mr-4"
      >
        <el-option
          v-for="item in sortMethodList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="filter.filename" placeholder="文件名" class="flex-1" />
    </div>
    <el-table :data="data.result" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="48" />
      <el-table-column label="Article UUID" width="128">
        <template #default="{ row }">
          <span class="truncate">{{ row.article_uuid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Filename" min-width="120">
        <template #default="{ row }">
          <div class="flex flex-row items-center whitespace-nowrap">
            <i class="bi bi-file-binary mr-2"></i>
            <h2 class="font-bold">{{ row.filename }}</h2>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Size" width="128">
        <template #default="{ row }">
          {{ sizeFormat(row.size) }}
        </template>
      </el-table-column>
      <el-table-column label="Upload Time" width="128">
        <template #default="{ row }">
          {{ timeFormat(row.uploaded_time) }}
        </template>
      </el-table-column>
      <el-table-column width="36">
        <template #default="{ row }">
          <div title="下载">
            <a
              :href="getPublicFileUrl(`attachments/${row.filename}`)"
              target="_blank"
            >
              <i class="bi bi-download"></i>
            </a>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <upload-dialog v-model="isUploadAttachmentDialogVisible"></upload-dialog>
</template>

<style scoped></style>
