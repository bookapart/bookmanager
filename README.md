# 📚 BookManager - 5 Willow Trees Library

> Private database & book search system for personal collections  
> 「五柳先生家庭图书馆」个人图书管理与检索系统

---

## ✨ 功能特点

- 🔍 **图书搜索**：支持书名、出版社、作者、类别、ISBN/书号/OCLC、中图分类号、书店或电商关键字检索  
- 🎲 **随机排序**：快速获取随机书籍列表  
- 🗂 **图书分类**：一键按类别查看馆藏  
- 📑 **分页展示**：支持翻页浏览  
- 🖼 **图册预览**：内置相册式预览模式  
- 📱 **响应式布局**：支持桌面与移动端浏览  
- 🛡 **隐私存储**：完全本地化，不依赖外部数据库  

---

## 🗂️ 项目结构

```
bookmanager/
├── index.html              # 首页
├── assets/
│   ├── css/
│   │   └── styles.min.css  # 自定义样式
│   ├── js/
│   │   ├── weui.min.js     # WeUI 前端框架
│   │   ├── books.min.js    # 图书数据（JSON）
│   │   └── app.min.js      # 业务逻辑脚本
│   └── images/             # 图标和素材
│       ├── cat.svg
│       ├── repeat.svg
│       └── ...
└── README.md
```

---

## 🚀 本地运行

1. 克隆仓库：

   ```bash
   git clone https://github.com/bookapart/bookmanager.git
   cd bookmanager
   ```

2. 启动本地静态服务器（任选其一）：

   - 使用 Python：

     ```bash
     python3 -m http.server 8080
     ```

   - 使用 Node.js (http-server)：

     ```bash
     npx http-server -p 8080
     ```

3. 打开浏览器访问：

   ```
   http://localhost:8080
   ```

---

## 📖 使用说明

- **搜索图书**：在输入框键入关键字并点击“查询”  
- **随机排序**：点击 🔄 按钮  
- **恢复顺序**：点击“按新得到顺序排序”按钮  
- **类别浏览**：点击“类别”按钮  
- **翻页**：使用“上一页 / 下一页”按钮切换  
- **查看大图**：点击封面图进入预览模式，点击关闭按钮返回  

---

## 🛠 技术栈

- [WeUI](https://weui.io/) — 微信官方设计组件库  
- 原生 JavaScript (ES6+)  
- 原生 HTML5 + CSS3  

---

## 📜 版权信息

- Private database &copy; Mr. 5 Willow Trees localhost81 2007–2025  
- 京ICP备2025141194号  

仅供学习与个人使用，禁止未经授权的商业用途。
