---
title: 在 Mardown 中使用组件
date: 2022-10-21 23:16:47
permalink: /pages/cacc80/
sidebar: auto
categories:
  - 随笔
tags:
  - 
author: 
  name: MYH
  link: https://github.com/mengyahui
---
## 一. 标记
在标题或其他内容中使用标记:

```md
#### 《沁园春·雪》 <Badge text="摘"/>
北国风光<Badge text="注释" type="warning"/>，千里冰封，万里雪飘。

> <Badge text="译文" type="error" vertical="middle"/>: 北方的风光。
```

效果:

#### 《沁园春·雪》 <Badge text="摘"/>
北国风光<Badge text="注释" type="warning"/>，千里冰封，万里雪飘。

<Badge text="译文" type="error" vertical="middle"/>: 北方的风光。

属性说明:
+ text - string
+ type - string, 可选值： tip | warning | error，默认： tip
+ vertical - string, 可选值： top | middle，默认： top
## 二. 代码块选项卡
在 `<code-group>` 中嵌套 `<code-block>`来配合使用。在 `<code-block>`标签添加title来指定tab标题，active指定当前tab：

```md
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
```

效果：

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

:::warning
- 请在 `<code-group>` 标签与markdown内容之间使用空行隔开，否则可能会解析不出来。
- 该组件只适用于放置代码块，放其他内容在体验上并不友好。如您确实需要放置其他内容的选项卡，推荐使用 vuepress-plugin-tabs 插件。
:::