<script setup lang="ts">
import { timeFormat } from "@/utils";
import type { ArticleBrief } from "@/types";
import { useAttachmentStore } from "@/stores/attachments";
import { useArticleStore } from "@/stores/articles";
import { deleteArticle, deleteAttachment } from "@/api/setter-api";

const articleStore = useArticleStore();
const attachmentStore = useAttachmentStore();

const page = ref(1);
const data = computed(() => {
  return articleStore.pagination({
    page: page.value,
    page_size: 10,
  });
});

const onDeleteArticleBtnClicked = (articles: ArticleBrief[]) => {
  if (articles.length === 0) {
    ElMessage.error("请选择文章。");
    return;
  }
  ElMessageBox.confirm("确定要删除这些文章吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage.info("正在删除文章...");

      articles.forEach((article) => {
        deleteArticle(article.uuid).then(() => {
          articleStore.deleteArticle(article.uuid);
          ElMessage.success(`文章${article.title}删除成功。`);
        });
      });

      ElMessageBox.confirm("是否删除文章附件？", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ElMessage.info("正在删除文章附件...");

          articles
            .reduce((acc, article) => {
              return acc.concat(
                attachmentStore
                  .selectAttachmentByArticleUUID(article.uuid)
                  .map((attachment) => attachment.filename)
              );
            }, [] as string[])
            .forEach((filename) => {
              deleteAttachment(filename).then(() => {
                attachmentStore.deleteAttachment(filename);
                ElMessage.success(`附件${filename}删除成功。`);
              });
            });
        })
        .catch(() => {});
    })
    .catch(() => {});
};

const selectionData = ref<ArticleBrief[]>([]);
const onSelectionChange = (selection: ArticleBrief[]) => {
  selectionData.value = selection;
};
</script>

<template>
  <div class="p-4 sm:p-8 pb-16 sm:pb-16 flex flex-col h-full">
    <div class="flex flex-row items-center mb-8">
      <i class="bi bi-file-earmark-text mr-2 text-xl"></i>
      <h1 class="text-2xl font-bold">文章设置</h1>
    </div>
    <div
      class="flex flex-col sm:flex-row justify-between items-center text-lg font-bold mb-4 select-none"
    >
      <div class="btn-group flex flex-row h-12">
        <router-link
          class="mx-4 py-2 hover:border-b-2 cursor-pointer border-b-black whitespace-nowrap"
          to="/admin/article/new"
        >
          <i class="bi bi-file-earmark-plus mr-2"></i>
          新建文章
        </router-link>
        <div
          class="mx-4 py-2 hover:border-b-2 cursor-pointer border-b-black whitespace-nowrap"
          @click="onDeleteArticleBtnClicked(selectionData)"
        >
          <i class="bi bi-file-earmark-x mr-2"></i>
          删除文章
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
    <el-table
      :data="data.result"
      @selection-change="onSelectionChange"
      class="flex-1 overflow-auto"
    >
      <el-table-column type="selection" width="48" />
      <el-table-column label="UUID" width="128">
        <template #default="{ row }">
          <span class="truncate">{{ row.uuid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title" :min-width="120">
        <template #default="{ row }">
          <h2 class="font-bold whitespace-nowrap">{{ row.title }}</h2>
        </template>
      </el-table-column>
      <el-table-column label="Created Time" width="128">
        <template #default="{ row }">
          {{ timeFormat(row.created_time) }}
        </template>
      </el-table-column>
      <el-table-column label="Action" width="72">
        <template #default="{ row }">
          <div class="flex flex-row items-center">
            <div class="mr-2" title="编辑">
              <router-link :to="`/admin/article/${row.uuid}`">
                <i class="bi bi-pencil-square"></i>
              </router-link>
            </div>
            <div title="文章页">
              <a :href="`/article/${row.uuid}`" target="_blank">
                <i class="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped></style>
