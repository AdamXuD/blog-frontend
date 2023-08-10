import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import mavonEditor from "mavon-editor";
import "@/assets/style/tailwind.css";
import "@/assets/style/base.css";
import "mavon-editor/dist/css/index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "highlight.js/styles/github-dark-dimmed.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(mavonEditor);

app.mount("#app");
