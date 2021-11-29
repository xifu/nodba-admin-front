## 如果我们没能力修好它，我们就会告诉你它根本没坏。

# 安装依赖
npm install

## 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务(本地开发)
```
卡古环境：
npm run dev:kg

源兴发环境：
npm run dev:yxf

重庆环境：
npm run dev:cqam
```

```

浏览器访问 http://localhost:9527

## 发布

# 构建测试环境
npm run build:stage

# 构建生产环境
卡古环境：
npm run build:kg
源兴发环境：
npm run build:yxf
重庆环境：
npm run build:cqam
```

# 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
