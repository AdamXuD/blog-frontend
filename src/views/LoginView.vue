<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";

import { postLogin } from "@/api/setter-api";
import { useStateStore } from "@/stores/title";

const router = useRouter();

const stateStore = useStateStore();

const props = defineProps<{
  redirect?: string;
}>();

const loginForm = reactive({
  username: "",
  password: "",
});
const keepLogin = ref(false);

const onLoginBtnClicked = () => {
  ElMessage.info("正在验证凭据...");

  postLogin(loginForm)
    .then((res) => {
      stateStore.token = res.token;
      if (keepLogin.value) {
        useLocalStorage("token", "").value = res.token;
      }
      ElMessage.success("登录成功。");
      router.push(props.redirect || "/admin/site");
    })
    .catch(() => {
      ElMessage.error("登录失败。");
    });
};
</script>

<template>
  <div
    class="w-5/6 sm:w-1/2 h-screen flex flex-col items-stretch justify-center mx-auto"
  >
    <h2 class="mb-8 text-2xl font-bold">登录</h2>
    <div class="h-32 w-full flex flex-col items-stretch justify-center">
      <el-form :model="loginForm">
        <el-form-item label="用户名" prop="username" :label-width="60">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="60">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div
      class="btn-group flex flex-row justify-between sm:justify-end font-bold h-12 select-none"
    >
      <div class="flex flex-row items-center mr-8">
        <span class="text-sm mr-4">保持登录</span>
        <el-switch v-model="keepLogin" />
      </div>
      <div
        class="mx-4 py-2 text-lg hover:border-b-2 border-b-black cursor-pointer"
        @click="onLoginBtnClicked"
      >
        登录
      </div>
    </div>
  </div>
</template>

<style scoped></style>
