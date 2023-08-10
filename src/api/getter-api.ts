import type { Article, Attachment, Metadata } from "@/types";

const publicPrefix: string = import.meta.env.VITE_BLOG_PUBLIC_PREFIX;

function getData(filepath: string): Promise<unknown> {
  return fetch(`${publicPrefix}${filepath}?t=${Date.now()}`)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .catch((err) => {
      console.error("数据文件加载失败:", err);
      return Promise.reject(err);
    });
}

export async function getMetadata(): Promise<Metadata> {
  return getData("metadata") as Promise<Metadata>;
}

export async function getArticleData(uuid: string): Promise<Article> {
  return getData(`articles/${uuid}/current`) as Promise<Article>;
}

export async function getArticleStageData(uuid: string): Promise<Article> {
  return getData(`articles/${uuid}/stage`) as Promise<Article>;
}

export async function getArticleBackupData(uuid: string): Promise<Article> {
  return getData(`articles/${uuid}/backup`) as Promise<Article>;
}

export async function getAttachmentList(): Promise<Attachment[]> {
  return getData("attachment-list") as Promise<Attachment[]>;
}
