# 个人书架

本地单人用的阅读记录页：记下想读、在读和读完的书。数据只存在当前浏览器，没有账号，也不接后端。

想读的书只占位子，**没有阅读进度和读后感**。翻开以后再拖进度、写页码；读完再打分和写一句感想。

## 怎么打开

在 `personal-shelf` 这一层起本地服务，再打开首页：

```bash
cd personal-shelf
python3 -m http.server 8767
```

浏览器访问：

http://127.0.0.1:8767/public/index.html

也可以直接用浏览器打开 `public/index.html`。

如果只在 `public/` 里起服务，样式和脚本的相对路径会找不到。

## 能做什么

- 上架新书，按状态切换表单：想读只填书名、作者、类型和优先级
- 在读书卡上拖进度，松手即保存，并留下一条进度记录
- 可选页码；填写全书页数后，进度和页码会互相换算
- 想读 → 开始读 → 读完了；读完可打 1–5 星
- 编辑已有书，`Esc` 取消编辑
- 按状态、类型筛选，按最近更新 / 上架 / 书名 / 进度排序
- 搜索书名、作者、类型或读后感
- 删除后 7 秒内可撤销
- 导出 / 导入 JSON，方便换浏览器时带走书架

示例数据是假的。换浏览器、无痕窗口或清站点数据后，会重新出现示例书。

## 目录

```
personal-shelf/
  public/index.html
  src/data/books.js
  src/scripts/lib/          数据规则、查询、本地存储
  src/scripts/ui/           卡片、表单、筛选、提示
  src/scripts/home.js       页面入口
  src/styles/               分层样式
```

仓库地址：https://github.com/HanoFleet/homework1
