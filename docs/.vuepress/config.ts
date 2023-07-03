/**
 * 提示：如您想使用JS版本的配置文件可参考：https://github.com/xugaoyi/vuepress-theme-vdoing/tree/a2f03e993dd2f2a3afdc57cf72adfc6f1b6b0c32/docs/.vuepress
 */
import {resolve} from 'path'
import {defineConfig4CustomTheme, UserPlugins} from 'vuepress/config'
import {VdoingThemeConfig} from 'vuepress-theme-vdoing/types'
// @ts-ignore
import dayjs from 'dayjs'
import baiduCode from './config/baiduCode' // 百度统计hm码
import htmlModules from './config/htmlModules' // 自定义插入的html块
import footer from './config/footer'
import social from "./config/social"
import blogger from "./config/blogger";
import author from "./config/author";
import nav from "./config/nav";

const DOMAIN_NAME = 'myh.com' // 域名 (不带https)
// const WEB_SITE = `https://${DOMAIN_NAME}` // 网址

export default defineConfig4CustomTheme<VdoingThemeConfig>({
    // theme: 'vdoing', // 使用npm主题包
    theme: resolve(__dirname, '../../vdoing'), // 使用本地主题包

    locales: {
        '/': {
            lang: 'zh-CN',
            title: "MYH's Blog",
            description: 'web前端技术博客,专注web前端学习与总结。JavaScript,js,ES6,TypeScript,vue,React,python,css3,html5,Node,git,github等技术文章。',
        }
    },
    // base: '/', // 默认'/'。如果你想将你的网站部署到如 https://foo.github.io/bar/，那么 base 应该被设置成 "/bar/",（否则页面将失去样式等文件）

    // 主题配置
    themeConfig: {

        nav: nav, // 导航配置
        sidebarDepth: 2, // 侧边栏显示深度，默认1，最大2（显示到h3标题）
        logo: '/img/avatar.jpg', // 导航栏logo
        searchMaxSuggestions: 5, // 搜索结果显示最大数
        lastUpdated: '上次更新', // 开启更新时间，并配置前缀文字   string | boolean (取值为git提交时间)
        docsDir: 'docs', // 编辑的文件夹
        docsBranch: 'main', // 编辑的文件所在分支，默认master。 注意：如果你的分支是main则修改为main
        editLinks: true, // 启用编辑
        editLinkText: '编辑',
        pageStyle: 'card',
        sidebarOpen: true, // 初始状态是否打开左侧边栏，默认true
        pageButton: false, // 是否显示快捷翻页按钮，默认true

        // bodyBgImg: 'https://cdn.jsdelivr.net/gh/mengyahui/image-repository@master/home/bgImg.6fn4ojw9urk0.jpg',


        category: true,         // 是否打开分类功能，默认 true
        tag: false,             // 是否打开标签功能，默认 true
        archive: false,         // 是否打开归档功能，默认 true
        categoryText: '随笔',     // 碎片化文章（_posts文件夹的文章）预设生成的分类值，默认'随笔'


        // 最近更新栏
        updateBar: {
          showToArticle: false, // 显示到文章页底部，默认true
          moreArticle: '/archives' // “更多文章”跳转的页面，默认'/archives'
        },
        rightMenuBar: true, // 是否显示右侧文章大纲栏，默认true (屏宽小于1300px下无论如何都不显示)

        // 侧边栏  'structuring' | { mode: 'structuring', collapsable: Boolean} | 'auto' | <自定义>    温馨提示：目录页数据依赖于结构化的侧边栏数据，如果你不设置为 'structuring',将无法使用目录页
        sidebar: 'structuring',

        // 文章默认的作者信息，(可在md文件中单独配置此信息) string | {name: string, link?: string}
        author: author,

        // 博主信息 (显示在首页侧边栏)
        blogger: blogger,

        // 社交图标 (显示于博主信息栏和页脚栏。内置图标：https://doc.xugaoyi.com/pages/a20ce8/#social)
        social: social,

        // 页脚信息
        footer: footer,

        // 扩展自动生成 frontmatter。（当md文件的 frontmatter 不存在相应的字段时将自动添加。不会覆盖已有的数据。）
        extendFrontmatter: {
            author: author
        },
        // 自定义 html (广告)模块
        htmlModules
    },

    // 注入到页面<head>中的标签，格式[tagName, { attrName: attrValue }, innerHTML?]
    head: [
        ['script', { src: 'https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js' }],
        ['script', { src: 'https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js' }],
        ['script', { src: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js' }],
        ['script', { src: 'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js' }],
        ['link', {rel: 'icon', href: '/img/favicon.ico'}], //favicons，资源放在public文件夹
        [
            'meta',
            {
                name: 'keywords',
                content: '博客,个人技术博客,后端,后端开发,后端框架,web前端,后端面试题,技术文档,学习,面试,Java,SpringBoot,MyBatis,MySQL,vue,Redis,SpringCloud,Nginx,MongoDB,git,Docker,markdown',
            },
        ],
        ['meta', {name: 'theme-color', content: '#11a8cd'}], // 移动浏览器主题颜色
    ],


    // 插件配置
    plugins: <UserPlugins>[

        ['@vuepress/nprogress'],

        // 代码块复制按钮
        [
            'one-click-copy',
            {
                copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'], // String or Array
                copyMessage: '复制成功', // default is 'Copy successfully and then paste it for use.'
                duration: 1000, // prompt message display time.
                showInMobile: false, // whether to display on the mobile side, default: false.
            },
        ],
        // demo演示模块
        [
            'demo-block',
            {
                settings: {
                    // jsLib: ['http://xxx'], // 在线示例(jsfiddle, codepen)中的js依赖
                    cssLib: [
                        'https://cdn.jsdelivr.net/npm/scss@0.2.4/src/index.min.js',
                        'https://cdn.jsdelivr.net/npm/less@4.1.3/dist/less.min.js',
                        'https://cdn.jsdelivr.net/npm/stylus@0.59.0/index.min.js'
                    ], // 在线示例中的css依赖
                    vue: 'https://fastly.jsdelivr.net/npm/vue/dist/vue.min.js', // 在线示例中的vue依赖
                    jsfiddle: true, // 是否显示 jsfiddle 链接
                    codepen: true, // 是否显示 codepen 链接
                    horizontal: false, // 是否展示为横向样式
                },
            },
        ],
        // 放大图片
        [
            'vuepress-plugin-zooming',
            {
                selector: '.theme-vdoing-content img:not(.no-zoom)', // 排除class是no-zoom的图片
                options: {
                    bgColor: 'rgba(0,0,0,0.6)',
                },
            },
        ],
        // "上次更新"时间格式
        [
            '@vuepress/last-updated',
            {
                transformer: (timestamp, lang) => {
                    return dayjs(timestamp).format('YYYY/MM/DD, HH:mm:ss')
                },
            },
        ],
    ],

    markdown: {
        lineNumbers: true,
        extractHeaders: ['h2', 'h3', 'h4', 'h5', 'h6'], // 提取标题到侧边栏的级别，默认['h2', 'h3']
    },

    // 监听文件变化并重新构建
    extraWatchFiles: [
        '.vuepress/config.ts',
        '.vuepress/config/htmlModules.ts',
    ]
})
