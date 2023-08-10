import { marked } from "marked";

import hljs from "highlight.js";
// import hljs from "highlight.js/lib/core";
// import javascript from "highlight.js/lib/languages/javascript";

import { markedHighlight } from "marked-highlight";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { createVNode, render } from "vue";

import ImgWrapper from "@/components/ImgWrapper.vue";

marked.use(
  markedHighlight({
    langPrefix: "language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);
marked.use(gfmHeadingId());

marked.setOptions({
  gfm: true,
  breaks: true,
  mangle: false,
});

function replaceImageElem(elem: HTMLElement) {
  const allImgSrc: string[] = [];
  elem.querySelectorAll("img").forEach((img, key) => {
    allImgSrc.push(img.getAttribute("src") || "");
    const elem = document.createElement("div");
    const vnode = createVNode(ImgWrapper, {
      src: img.getAttribute("src"),
      previewSrcList: allImgSrc,
      initialIndex: key,
    });
    render(vnode, elem);
    img.replaceWith(elem.firstElementChild as Node);
  });
}

function replaceTableElem(elem: HTMLElement) {
  elem.querySelectorAll("table").forEach((table) => {
    const elem = document.createElement("div");
    elem.classList.add("overflow-x-auto", "scroll");
    table.replaceWith(elem);
    elem.appendChild(table);
  });
}

export function renderArticle(elem: HTMLElement, content: string) {
  const tmpElem = document.createElement("div");
  tmpElem.innerHTML = marked.parse(content);
  replaceImageElem(tmpElem);
  replaceTableElem(tmpElem);
  elem.innerHTML = "";
  elem.append(...tmpElem.childNodes);
}

export function searchInRenderedArticle(content: string, keyword: string) {
  const tmpElem = document.createElement("div");
  tmpElem.innerHTML = marked.parse(content);
  const res = [...tmpElem.querySelectorAll("h1, h2, h3, h4, h5, h6, p")].find(
    (elem) => {
      return elem.textContent
        ? new RegExp(keyword, "i").test(elem.textContent)
        : false;
    }
  );
  return res?.textContent || null;
}
