import type { Site } from "@/types";
import { defineStore } from "pinia";

export const useSiteStore = defineStore("site", () => {
  const site = reactive({
    title: "",
    description: "",
    github: "",
    email: "",
    footer: "",
  });

  const initSiteData = (data: Site) => {
    return Object.assign(site, data);
  };

  return { site, initSiteData };
});
