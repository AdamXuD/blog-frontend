import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

export const useStateStore = defineStore("state", () => {
  const subtitle = ref("");
  const token = ref(useLocalStorage("token", "").value);

  return {
    subtitle,
    token,
  };
});
