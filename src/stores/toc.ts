import { defineStore } from "pinia";

export const useTOCStore = defineStore("toc", () => {
  const TOCList = reactive<
    {
      title: string;
      level: number;
      anchor: string;
      scrollIntoView: () => void;
    }[]
  >([]);
  const isTOCVisible = ref(false);
  const activeTOCId = ref("");

  const generateTOC = (elem: HTMLElement) => {
    TOCList.splice(0, TOCList.length);
    activeTOCId.value = "";
    const headers = elem.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headers.forEach((header) => {
      const title = header.textContent;
      const level = parseInt(header.tagName[1]);
      const anchor = header.id;
      TOCList.push({
        title: title ? title : "",
        level: level,
        anchor: anchor ? anchor : "",
        scrollIntoView: () =>
          header.scrollIntoView({
            block: "start",
            inline: "start",
            behavior: "smooth",
          }),
      });
    });
  };

  const setActiveTOC = (id: string) => {
    activeTOCId.value = id;
  };

  return {
    TOCList,
    isTOCVisible,
    activeTOCId,
    generateTOC,
    setActiveTOC,
  };
});
