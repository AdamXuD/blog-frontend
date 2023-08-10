import type { ArticleBrief, Article } from "@/types";
import { getArticleData } from "@/api/getter-api";

import { defineStore } from "pinia";
import { searchInRenderedArticle } from "@/utils/render";

export const useArticleStore = defineStore("article", () => {
  const articleBriefList: ArticleBrief[] = reactive([]);
  const articleDetailMap = reactive<{ [key: string]: Article }>({});

  const initArticleBriefList = (data: ArticleBrief[]) => {
    articleBriefList.splice(0, articleBriefList.length, ...data);
  };

  const isArticleExist = (uuid: string) => {
    return articleBriefList.findIndex((item) => item.uuid === uuid) !== -1;
  };

  const pagination = (option: { page: number; page_size: number }) => {
    const { page, page_size } = option;
    const pageStart = (page - 1) * page_size;
    const pageEnd = pageStart + page_size;
    return {
      result: articleBriefList.slice(pageStart, pageEnd),
      total_page: Math.ceil(articleBriefList.length / page_size),
    };
  };

  const getArticleNeighbor = (uuid: string) => {
    const index = articleBriefList.findIndex((item) => item.uuid === uuid);
    if (index === -1) return { next: undefined, prev: undefined };
    return {
      next: articleBriefList[index + 1],
      prev: articleBriefList[index - 1],
    };
  };

  const getArticleDetail = async (uuid: string) => {
    if (articleBriefList.findIndex((item) => item.uuid === uuid) === -1) {
      return Promise.reject();
    }
    if (articleDetailMap[uuid]) {
      return Promise.resolve(articleDetailMap[uuid]);
    } else {
      return getArticleData(uuid).then((res) => {
        articleDetailMap[uuid] = res;
        return res;
      });
    }
  };

  const deleteArticle = (uuid: string) => {
    const index = articleBriefList.findIndex((item) => item.uuid === uuid);
    if (index !== -1) {
      articleBriefList.splice(index, 1);
    }
  };

  const insertArticle = (article: ArticleBrief) => {
    articleBriefList.push(article);
  };

  const updateArticle = (article: ArticleBrief) => {
    const index = articleBriefList.findIndex(
      (item) => item.uuid === article.uuid
    );
    if (index !== -1) {
      articleBriefList.splice(index, 1, article);
    }
  };

  const search = async (keyword: string) => {
    const result: {
      article: Article;
      matchedParagraph: string;
    }[] = [];
    if (!keyword) return result;
    articleBriefList.forEach(async (item) => {
      const article = await getArticleDetail(item.uuid).catch(() => null);
      if (!article) return;
      const mt = article.title.match(keyword);
      const mp = searchInRenderedArticle(article.content, keyword);
      if (mt || mp) {
        console.log("push");

        result.push({ article, matchedParagraph: mp || article.title });
      }
    });
    return result;
  };

  return {
    articleBriefList,
    initArticleBriefList,
    pagination,
    deleteArticle,
    insertArticle,
    updateArticle,

    isArticleExist,
    getArticleNeighbor,
    getArticleDetail,
    search,
  };
});
