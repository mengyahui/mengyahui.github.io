---
title: Markdown写作技巧
date: 2023-03-25 13:00:22
permalink: /pages/0c6e5d/
sidebar: auto
sticky: 1
categories:
  - 随笔
tags:
  - 
author: 
  name: MYH
  link: https://github.com/mengyahui
---

## 一、Markdown 容器

Markdown 容器是对 Markdown 语法的一个扩展，使用简单的语法就可以在页面中呈现丰富的效果。

### 1.1 信息框容器

**输入：**

```markdown
::: tip
这是一条提示
:::

::: warning
这是一条注意
:::

::: danger
这是一条警告
:::

::: note
这是笔记容器，在 <Badge text="v1.5.0 +" /> 版本才支持哦~
:::

```

**输出：**

::: tip
这是一条提示
:::

::: warning
这是一条注意
:::

::: danger
这是一条警告
:::

::: note
这是笔记容器，在 <Badge text="v1.5.0 +" /> 版本才支持哦~
:::

以上容器均可自定义标题，如：

```markdown
::: tip 我的提示
自定义标题的提示框
:::
```

### 1.2 布局容器

**输入：**

````markdown
::: center
  ### 我是居中的内容
  （可用于标题、图片等的居中）
:::

::: right
  [我是右浮动的内容](https://www.baidu.com)
:::

::: details
这是一个详情块，在 IE / Edge 中不生效
```js
console.log('这是一个详情块')
```
:::

::: theorem 牛顿第一定律
假若施加于某物体的外力为零，则该物体的运动速度不变。
::: right
来自 [百度百科](https://baike.baidu.com/)
:::
````

**输出：**

::: center
  ### 我是居中的内容
  （可用于标题、图片等的居中）
:::

::: right
  [我是右浮动的内容](https://www.baidu.com)
:::

::: details
这是一个详情块，在 IE / Edge 中不生效
```js
console.log('这是一个详情块')
```
:::

::: theorem 牛顿第一定律
假若施加于某物体的外力为零，则该物体的运动速度不变。
::: right
来自 [百度百科](https://baike.baidu.com/)
:::

### 1.3 普通卡片列表

普通卡片列表容器，可用于`友情链接`、`项目推荐`、`诗词展示`等。

**语法：**

````markdown
::: cardList <每行显示数量>
``` yaml
- name: 名称
  desc: 描述
  avatar: https://xxx.jpg # 头像，可选
  link: https://xxx/ # 链接，可选
  bgColor: '#CBEAFA' # 背景色，可选，默认var(--bodyBg)。颜色值有#号时请添加引号
  textColor: '#6854A1' # 文本色，可选，默认var(--textColor)
```
:::
````

**输入：**

````markdown
::: cardList
```yaml
- name: 麋鹿鲁哟
  desc: 大道至简，知易行难
  avatar: https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200122153807.jpg # 可选
  link: https://www.cnblogs.com/miluluyo/ # 可选
  bgColor: '#CBEAFA' # 可选，默认var(--bodyBg)。颜色值有#号时请添加单引号
  textColor: '#6854A1' # 可选，默认var(--textColor)
- name: XAOXUU
  desc: '#IOS #Volantis主题作者'
  avatar: https://fastly.jsdelivr.net/gh/xaoxuu/assets@master/avatar/avatar.png
  link: https://xaoxuu.com
  bgColor: '#718971'
  textColor: '#fff'
- name: 平凡的你我
  desc: 理想成为大牛的小陈同学
  avatar: https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200122153807.jpg
  link: https://reinness.com
  bgColor: '#FCDBA0'
  textColor: '#A05F2C'
```
:::
````

**输出：**

::: cardList
```yaml
- name: 麋鹿鲁哟
  desc: 大道至简，知易行难
  avatar: https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200122153807.jpg # 可选
  link: https://www.cnblogs.com/miluluyo/ # 可选
  bgColor: '#CBEAFA' # 可选，默认var(--bodyBg)。颜色值有#号时请添加单引号
  textColor: '#6854A1' # 可选，默认var(--textColor)
- name: XAOXUU
  desc: '#IOS #Volantis主题作者'
  avatar: https://fastly.jsdelivr.net/gh/xaoxuu/assets@master/avatar/avatar.png
  link: https://xaoxuu.com
  bgColor: '#718971'
  textColor: '#fff'
- name: 平凡的你我
  desc: 理想成为大牛的小陈同学
  avatar: https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200122153807.jpg
  link: https://reinness.com
  bgColor: '#FCDBA0'
  textColor: '#A05F2C'
```
:::

### 1.4 图文卡片列表

图文卡片列表容器，可用于`项目展示`、`产品展示`等。

**语法：**

````markdown
::: cardImgList <每行显示数量>
``` yaml
- img: https://xxx.jpg # 图片地址
  link: https://xxx.com # 链接地址
  name: 标题
  desc: 描述 # 可选
  author: 作者名称 # 可选
  avatar: https://xxx.jpg # 作者头像，可选
```
:::
````

**输入：**

````markdown
::: cardImgList
```yaml
- img: https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200529162253.jpg
  link: https://xugaoyi.com/
  name: 标题
  desc: 描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容 # 描述，可选
  author: MYH # 作者，可选
  avatar: https://cdn.staticaly.com/gh/mengyahui/image-repository@master/20221017/touxiang.webp # 头像，可选
- img: https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200530100256.jpg
  link: https://xugaoyi.com/
  name: 标题
  desc: 描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容
  author: MYH
  avatar: https://cdn.staticaly.com/gh/mengyahui/image-repository@master/20221017/touxiang.webp
- img: https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200530100257.jpg
  link: https://xugaoyi.com/
  name: 标题
  desc: 描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容
  author: MYH
  avatar: https://cdn.staticaly.com/gh/mengyahui/image-repository@master/20221017/touxiang.webp
```
:::
````

**输出：**

::: cardImgList
```yaml
- img: https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200529162253.jpg
  link: https://mengyahui.github.io/
  name: 标题
  desc: 描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容 # 描述，可选
  author: MYH # 作者，可选
  avatar: https://cdn.staticaly.com/gh/mengyahui/image-repository@master/20221017/touxiang.webp # 头像，可选
- img: https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200530100256.jpg
  link: https://mengyahui.github.io/
  name: 标题
  desc: 描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容
  author: MYH
  avatar: https://cdn.staticaly.com/gh/mengyahui/image-repository@master/20221017/touxiang.webp
- img: https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200530100257.jpg
  link: https://mengyahui.github.io/
  name: 标题
  desc: 描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容
  author: MYH
  avatar: https://cdn.staticaly.com/gh/mengyahui/image-repository@master/20221017/touxiang.webp
```
:::

### 1.5 增强配置

#### 1. 普通卡片和图文卡片

**target：**

链接的打开方式，默认`_blank` 新窗口打开，`_self` 当前页面打开。

#### 2. 图文卡片

**imgHeight：**

- 设置图片高度，默认 `auto`，带单位。

**objectFit：**

设置图片的填充方式(object-fit)，默认 `cover`

- `fill` 拉伸 (会改变宽高比)

- `contain` 缩放 (保持宽高比，会留空)
- `cover` 填充 (会裁剪)
- `none` 保持原有尺寸 (会留空或裁剪)
- `scale-down` 保证显示完整图片 (保持宽高比，会留空)

**lineClamp：**

- 描述文本超出多少行显示省略号，默认`1`

## 二、标记

### 2.1 内置标记

vuepress 主题内置的 [Badge组件]([在 Markdown 中使用 Vue | VuePress (vuejs.org)](https://vuepress.vuejs.org/zh/guide/using-vue.html#内置的组件))，可以直接在 Markdown 中使用。

- text：标记文本

- type：可选值，`top | warning | error` ，默认值是 `top`

- vertical：可选值： `top | middle`，默认值是： `top`

```html
<Badge text="beta" type="warning"/>
<Badge text="16.0++"/>
```

<Badge text="beta" type="warning"/>
<Badge text="16.0++"/>

### 2.2 外部标记

使用 [shields ](https://shields.io/)生成标记，在Markdown中使用，可以生成动态统计数据。

```markdown
![npm](https://img.shields.io/npm/v/vuepress-theme-vdoing)
![star](https://img.shields.io/github/stars/xugaoyi/vuepress-theme-vdoing)
```

![npm](https://img.shields.io/npm/v/vuepress-theme-vdoing)![star](https://img.shields.io/github/stars/xugaoyi/vuepress-theme-vdoing)

## 三、demo 演示框

使用的是 [vuepress-plugin-demo-block](https://www.npmjs.com/package/vuepress-plugin-demo-block)插件，使用方法可参考插件文档。下面是一个实例：

**输入：**

````markdown
::: demo
```html
<template>
  <div>
    <div class="avatar">
      <div class="user-avatar">
        <img class="avatar-image" src="https://cdn.staticaly.com/gh/mengyahui/image-repository@master/20221017/avatar.6lzgujewu7w0.jpg"/>
      </div>

      <div class="user-avatar">
        <img class="avatar-image" src="https://cdn.staticaly.com/gh/mengyahui/image-repository@master/20221017/touxiang.webp"/>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
      
  }
</script>

<style>
.avatar {
  display: flex;
  }
.user-avatar {
  border-radius: 50%;
  height: 64px;
  width: 64px;
  border: 1px solid #ddd;
  margin-left: 20px;
}
.avatar-image {
  border-radius: 50%;
  height: 100%;
  width: 100%;
  object-fit: cover; /*按图片原有尺寸比例来裁剪*/
}
</style>
```
:::
````

**输出：**

::: demo
```html
<template>
  <div>
    <div class="avatar">
      <div class="user-avatar">
        <img class="avatar-image" src="https://cdn.staticaly.com/gh/mengyahui/image-repository@master/20221017/avatar.6lzgujewu7w0.jpg"/>
      </div>

      <div class="user-avatar">
        <img class="avatar-image" src="https://cdn.staticaly.com/gh/mengyahui/image-repository@master/20221017/touxiang.webp"/>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
      
  }
</script>

<style>
.avatar {
  display: flex;
  }
.user-avatar {
  border-radius: 50%;
  height: 64px;
  width: 64px;
  border: 1px solid #ddd;
  margin-left: 20px;
}
.avatar-image {
  border-radius: 50%;
  height: 100%;
  width: 100%;
  object-fit: cover; /*按图片原有尺寸比例来裁剪*/
}
</style>
```
:::

## 四、代码选项卡

在`<code-group>`中嵌套`<code-block>`来配合使用。在`<code-block>`标签添加`title`来指定tab标题，`active`指定当前tab：

**输入：**

````markdown
<code-group>
  <code-block title="YARN" active>
  ```bash
  yarn add vuepress-theme-vdoing -D
  ```
  </code-block>

  <code-block title="NPM">
  ```bash
  npm install vuepress-theme-vdoing -D
  ```
  </code-block>
</code-group>
````

**输出：**

<code-group>
  <code-block title="YARN" active>
  ```bash
  yarn add vuepress-theme-vdoing -D
  ```
  </code-block>

  <code-block title="NPM">
  ```bash
  npm install vuepress-theme-vdoing -D
  ```
  </code-block>
</code-group>
