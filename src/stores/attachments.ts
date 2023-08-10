import type { Attachment } from "@/types";
import { defineStore } from "pinia";

export const useAttachmentStore = defineStore("attachment", () => {
  const attachmentList: Attachment[] = reactive([]);

  const initAttachmentList = (data: Attachment[]) => {
    attachmentList.splice(0, attachmentList.length, ...data);
  };

  const insertAttachment = (attachment: Attachment) => {
    attachmentList.push(attachment);
  };

  const selectAttachmentByArticleUUID = (uuid: string) => {
    return attachmentList.filter((item) => item.article_uuid === uuid);
  };

  const deleteAttachment = (filename: string) => {
    const index = attachmentList.findIndex(
      (item) => item.filename === filename
    );
    if (index !== -1) {
      attachmentList.splice(index, 1);
    }
  };

  const updateAttachment = (filename: string, uuid: string) => {
    const index = attachmentList.findIndex(
      (item) => item.filename === filename
    );
    if (index !== -1) {
      attachmentList[index].article_uuid = uuid;
    }
  };

  const filter = (option: {
    page: number;
    page_size: number;
    article_uuid: string;
    sort_method: string;
    filename: string;
  }) => {
    const { page, page_size, article_uuid, sort_method, filename } = option;
    let result = attachmentList;

    if (article_uuid && article_uuid.length > 0) {
      result = result.filter((item) => {
        return item.article_uuid === article_uuid;
      });
    }

    if (filename && filename.length > 0) {
      result = result.filter((item) => item.filename.includes(filename));
    }

    switch (sort_method) {
      case "size_asc":
        result = result.sort((a, b) => a.size - b.size);
        break;
      case "size_desc":
        result = result.sort((a, b) => b.size - a.size);
        break;
      case "upload_time_asc":
        result = result.sort((a, b) => a.uploaded_time - b.uploaded_time);
        break;
      case "upload_time_desc":
      default:
        result = result.sort((a, b) => b.uploaded_time - a.uploaded_time);
        break;
    }

    const pageStart = (page - 1) * page_size;
    const pageEnd = pageStart + page_size;
    return {
      result: result.slice(pageStart, pageEnd),
      total_page: Math.ceil(result.length / page_size),
    };
  };

  return {
    attachmentList,
    initAttachmentList,
    insertAttachment,
    deleteAttachment,
    updateAttachment,
    selectAttachmentByArticleUUID,
    filter,
  };
});
