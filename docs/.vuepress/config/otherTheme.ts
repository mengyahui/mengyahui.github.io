export default {
    // 导航栏右侧生成Github链接
    repo: '',

    // body 背景大图，默认无。单张图片 String | 多张图片 Array, 多张图片时隔 bodyBgImgInterval 切换一张。
    bodyBgImg: [
      'https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175828.jpeg',
      'https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175845.jpeg',
      'https://fastly.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175846.jpeg'
    ],
    bodyBgImgOpacity: 0.5, // body背景图透明度，选值 0.1~1.0, 默认0.5
    bodyBgImgInterval: 15, // body多张背景图时的切换间隔, 默认15，单位s

    // 文章页面配置
    titleBadge: true, // 文章标题前的图标是否显示，默认true
    titleBadgeIcons: [ // 文章标题前图标的地址，默认主题内置图标
      '图标地址1',
      '图标地址2'
    ],

    contentBgStyle: 1, // 文章内容块的背景风格，默认无. 1 方格 | 2 横线 | 3 竖线 | 4 左斜线 | 5 右斜线 | 6 点状

    // 默认外观模式,可选：'auto' | 'light' | 'dark' | 'read'，默认 'auto'。
    defaultMode: 'auto',
    /**
     * 页面风格 类型: String
     * card: 卡片
     * line: 线（未设置bodyBgImg时才生效）
     * 说明：card 时背景显示灰色衬托出卡片样式，line 时背景显示纯色，并且部分模块带线条边框
     */
    pageStyle: 'card', // 默认 card
}