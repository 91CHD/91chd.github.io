# Tian 的个人主页


公开主页：https://91chd.github.io/

源码仓库：https://github.com/91CHD/91chd.github.io

在线更新内容：https://github.com/91CHD/91chd.github.io/edit/main/content.json

一个为 GitHub Pages 制作的个人主页，包含项目介绍、公开任务进展、开发记录、深浅主题、项目详情和手机适配。纯 HTML / CSS / JavaScript，无需安装依赖或构建。

## 文件

- `index.html`：页面结构与个人介绍。
- `styles.css`：布局、主题和响应式样式。
- `site.js`：内容读取、主题切换和项目详情交互。
- `content.json`：项目、任务和开发记录。更新网站主要编辑此文件。
- `.nojekyll`：让 GitHub Pages 直接发布静态文件。

## 本地预览

在本目录打开终端，运行：

```sh
python -m http.server 8000
```

在浏览器访问 `http://localhost:8000`。请通过 HTTP 预览；直接双击 HTML 可能无法读取 `content.json`。

## 发布到 GitHub Pages

1. 使用自己的 GitHub 用户名创建公开仓库，名称为 `用户名.github.io`。
2. 将本目录文件放在仓库根目录，包含 `.nojekyll`，提交到 `main` 分支。
3. 进入仓库 **Settings → Pages**。
4. 在 **Source** 选择 **Deploy from a branch**，选择 **main / (root)**，点击 **Save**。
5. 等待发布完成，访问 `https://用户名.github.io/`。

若此仓库已经存在，应先检查内容再合并，避免覆盖原有主页。

## 怎样更新公开进度

在 GitHub 仓库打开 `content.json`，点击编辑，修改后提交。网站会在重新发布后同步更新。

- `github`：填写自己的 GitHub 个人主页链接，填写前该入口会隐藏。
- `updated`：填写实际更新日期，例如 `2026-10-09`。
- `tasks[].status`：`todo`（待开始）、`doing`（进行中）、`done`（已完成）。
- `journal`：新记录添加在数组开头，包含日期、标题、正文与分类。
- `projects`：准确写明自己的贡献、当前进展和下一步。

当前版本使用整站统一的亚丝娜淡背景，左上角 Tian 可打开个人介绍。待做清单保留四项，开发记录仅列个人主页上线和后续待定。

这是公开静态主页，任务通过 GitHub 的账号权限管理；网页上的任务状态是全体访客看到的公开记录。浏览器本地仅保存主题偏好，不保存或伪装同步任务状态。

页面未发布实验室数据、导师姓名、联系方式或其他个人生活资料。

GitHub Pages 官方文档：https://docs.github.com/en/pages/quickstart
