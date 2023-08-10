import { createRouter, createWebHistory } from "vue-router";
import PublicMainView from "@/views/public/MainView.vue";
import PublicPageView from "@/views/public/children/PageView.vue";
import PublicArticleView from "@/views/public/children/ArticleView.vue";
import { useStateStore } from "@/stores/title";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: PublicMainView,
      meta: {
        requiresAuth: false,
      },
      children: [
        {
          path: "",
          name: "home",
          component: PublicPageView,
          props: () => ({ page: 1 }),
        },
        {
          path: "page/:page",
          name: "page",
          component: PublicPageView,
          props: (router) => {
            const page = Number(router.params.page);
            return {
              page: Number.isNaN(page) ? 1 : page,
            };
          },
        },
        {
          path: "article/:uuid",
          name: "article",
          component: PublicArticleView,
          props: true,
        },
      ],
    },
    {
      path: "/login",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        requiresAuth: false,
      },
      props: (router) => ({ redirect: router.query.redirect }),
    },
    {
      path: "/admin",
      component: () => import("@/views/admin/MainView.vue"),
      redirect: "/site",
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "site",
          name: "site",
          component: () => import("@/views/admin/children/SiteView.vue"),
          meta: {
            title: "站点管理",
          },
        },
        {
          path: "article",
          children: [
            {
              path: "",
              name: "article-list",
              component: () => import("@/views/admin/children/ArticleView.vue"),
              meta: {
                title: "文章管理",
              },
            },
            {
              path: ":uuid",
              name: "article-edit",
              component: () =>
                import("@/views/admin/children/ArticleEditView.vue"),
              props: (router) => ({
                uuid: router.params.uuid,
                mode: "edit",
              }),
              meta: {
                title: "文章编辑",
              },
            },
            {
              path: "new",
              name: "article-new",
              component: () =>
                import("@/views/admin/children/ArticleEditView.vue"),
              props: () => ({
                uuid: "",
                mode: "new",
              }),
              meta: {
                title: "新建文章",
              },
            },
          ],
        },
        {
          path: "attachment",
          name: "attachment",
          component: () => import("@/views/admin/children/AttachmentView.vue"),
          meta: {
            title: "附件管理",
          },
        },
      ],
    },

    {
      path: "/404",
      name: "notfound",
      component: () => import("@/views/NotFoundView.vue"),
      meta: {
        requiresAuth: false,
        title: "404喵",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404",
    },
  ],
  scrollBehavior() {
    return {
      top: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach((to, from, next) => {
  const token = useStateStore().token;
  if (to.meta.requiresAuth) {
    if (token) {
      next();
    } else {
      next({ path: "/login", query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
});

export default router;
