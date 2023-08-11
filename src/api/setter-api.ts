import { useStateStore } from "@/stores/title";
import type { Article, Site } from "@/types";
import { fetchWrapper } from "@/utils";

const apiPrefix: string = import.meta.env.VITE_BLOG_API_PREFIX;

function request(url: string, options?: RequestInit) {
  const token = useStateStore().token;
  return fetchWrapper(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

export function putAvatar(pngFile: File) {
  return request(`${apiPrefix}api/admin/avatar`, {
    method: "PUT",
    body: pngFile,
  });
}

export function putSite(data: Site) {
  return request(`${apiPrefix}api/admin/site`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function postArticle(data: Article) {
  return request(`${apiPrefix}api/admin/article`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function putArticle(data: Article) {
  return request(`${apiPrefix}api/admin/article`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function putArticleStage(data: Article) {
  return request(`${apiPrefix}api/admin/article/stage`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function deleteArticle(uuids: string[]) {
  return request(`${apiPrefix}api/admin/article`, {
    method: "DELETE",
    body: JSON.stringify({ uuids }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function postAttachment(uuid: string, filename: string, file: File) {
  return request(
    `${apiPrefix}api/admin/attachment?filename=${filename}&uuid=${uuid}`,
    {
      method: "POST",
      body: file,
    }
  );
}

export function deleteAttachment(filenames: string[]) {
  return request(`${apiPrefix}api/admin/attachment`, {
    method: "DELETE",
    body: JSON.stringify({ filenames }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function postLogin(loginForm: {
  username: string;
  password: string;
}): Promise<{
  token: string;
}> {
  return request(`${apiPrefix}api/public/login`, {
    method: "POST",
    body: JSON.stringify(loginForm),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export function putInit() {
  return request(`${apiPrefix}api/admin/init`, {
    method: "PUT",
  });
}

export function putRecover() {
  return request(`${apiPrefix}api/admin/recover`, {
    method: "PUT",
  });
}
