import { useStateStore } from "@/stores/title";
import type { Article, Site } from "@/types";

const apiPrefix: string = import.meta.env.VITE_BLOG_API_PREFIX;

export function putAvatar(pngFile: File) {
  const token = useStateStore().token;
  return fetch(`${apiPrefix}api/admin/avatar`, {
    method: "PUT",
    body: pngFile,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function putSite(data: Site) {
  const token = useStateStore().token;
  return fetch(`${apiPrefix}api/admin/site`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function postArticle(data: Article) {
  const token = useStateStore().token;
  return fetch(`${apiPrefix}api/admin/article`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function putArticle(data: Article) {
  const token = useStateStore().token;
  return fetch(`${apiPrefix}api/admin/article`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function putArticleStage(data: Article) {
  const token = useStateStore().token;
  return fetch(`${apiPrefix}api/admin/article/stage`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteArticle(uuid: string) {
  const token = useStateStore().token;
  return fetch(`${apiPrefix}api/admin/article`, {
    method: "DELETE",
    body: JSON.stringify({ uuid }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function postAttachment(uuid: string, filename: string, file: File) {
  const token = useStateStore().token;
  return fetch(
    `${apiPrefix}api/admin/attachment?filename=${filename}&uuid=${uuid}`,
    {
      method: "POST",
      body: file,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function deleteAttachment(filename: string) {
  const token = useStateStore().token;
  return fetch(`${apiPrefix}api/admin/attachment`, {
    method: "DELETE",
    body: JSON.stringify({ filename }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function putAttachment(filename: string, uuid: string) {
  const token = useStateStore().token;
  return fetch(`${apiPrefix}api/admin/attachment`, {
    method: "PUT",
    body: JSON.stringify({ filename, uuid }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function postLogin(loginForm: {
  username: string;
  password: string;
}): Promise<{
  token: string;
}> {
  const token = useStateStore().token;
  return fetch(`${apiPrefix}api/public/login`, {
    method: "POST",
    body: JSON.stringify(loginForm),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

export function putInit() {
  const token = useStateStore().token;
  return fetch(`${apiPrefix}api/admin/init`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function putRecover() {
  const token = useStateStore().token;
  return fetch(`${apiPrefix}api/admin/recover`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
