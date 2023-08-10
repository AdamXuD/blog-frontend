# blog-frontend

这是自用博客的前端部分，包含完善的文章展示功能以及带鉴权的文章管理与附件管理功能。

推荐部署到Cloudflare Pages中，整套系统满足Serverless思想。



## 推荐IDE配置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).



## 使用方法

### 本地部署（开发部署）

1. 若将项目中的`.env.example`文件复制一份命名为`.env`，并补充公共请求链接前缀`VITE_BLOG_PUBLIC_PREFIX`及API链接前缀`VITE_BLOG_API_PREFIX`（关于前缀作用下方会进行说明）。

2. 在控制台中执行`npm i`。

3. 在控制台中执行`npm run dev`即可在本地运行一个热重载开发服务器，执行`npm run build` 即可在本地编译生产文件。



### Cloudflare Pages部署

1. 将本仓库`Fork`到自己的账号下。

2. 登录到`Cloudflare`，在`Cloudflare`中打开找到`Worker & Pages`界面。

3. 若是`Cloudflare Pages`新用户的话直接选择使用免费套餐并绑定支付方式即可。

4. 在`Cloudflare Pages`页面中`Create Application`，选择`Connect to Git`绑定自己的`Github`账户，并选择刚刚`Fork`的仓库。

5. 在详情页面中仅需修改`Framework preset`为Vue，并在下方的`Environment variables (advanced)`中添加公共请求链接前缀`VITE_BLOG_PUBLIC_PREFIX`及API链接前缀`VITE_BLOG_API_PREFIX`（关于前缀作用下方会进行说明）。

6. 最后进行`Save and Deploy`。

7. 部署完毕后可在`Pages`设置页面的`Custom domains`绑定自己的域名（前提是自己的域名套了`DNS`代理）。



## 关于环境变量中的链接前缀

由于我在设计该博客的最首要的要求是不使用服务器，即Serverless应用。

但是有部分功能不依靠后端又无法设计，故折衷后选择使用Cloudflare Worker作为管理端的后端处理负责鉴权以及处理管理端请求，使用Cloudflare R2对象存储作为数据存储以及面向公共领域进行数据分发。

即大伙儿在请求文章的时候相当于直接向Cloudflare R2对象存储服务直接请求包含文章数据的文件，这个步骤不需要鉴权。我对文章进行修改的时候必须先向Cloudflare Worker进行登录操作拿到token，再拿着token向Cloudflare Worker请求以进行文章和附件的增删改查功能。

故公共请求链接前缀`VITE_BLOG_PUBLIC_PREFIX`即是Cloudflare R2对象存储的公开链接前缀，API链接前缀`VITE_BLOG_API_PREFIX`即是Cloudflare Worker的API链接前缀。
