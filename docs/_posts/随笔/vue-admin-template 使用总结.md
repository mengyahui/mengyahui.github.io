vue-element-admin 是一个基于 vue 和 element-ui 的后台前端解决方案，内置了动态路由、权限验证等业务模型，提供了丰富的功能组件，可以用于速搭建企业级中后台产品原型。

vue-element-admin 的定位是后台集成方案，集成了很多可能用不到的功能，会造成不少的代码冗余。不太适合当基础模板来进行二次开发。建议使用基础模板 vue-admin-template 进行二次开发，需要用到的组件可以直接从 vue-element-admin 上面拷贝。

**官方文档**：https://panjiachen.gitee.io/vue-element-admin-site/zh/

**项目在线预览：**https://panjiachen.gitee.io/vue-element-admin

## 一、快速上手

### 1.1 安装运行

```shell
# 克隆 vue-admin-template
git clone https://github.com/PanJiaChen/vue-admin-template.git

# 切换到项目目录
cd vue-admin-template

# 安装依赖
npm install

# 运行
npm run dev
```

运行完以上命令，即可在浏览器看到后台项目的登录页面

![image-20230328212856681](https://cdn.staticaly.com/gh/mengyahui/image-repository@master/杂项/image-20230328212856681.bjj8wg8fomw.png)

点击登录后进入后台项目主页面

![image-20230328212817095](https://cdn.staticaly.com/gh/mengyahui/image-repository@master/杂项/image-20230328212817095.3lhhz9ni2vs0.png)

### 1.2 目录结构

下面是 vue-admin-template 项目的目录结构

```sh
├── dist					   # 生产环境打包生成的打包项目
├── build                      # 构建相关
├── mock                       # 项目mock 模拟数据
├── public                     # 静态资源,包含会被自动打包到项目根路径的文件夹
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 包含接口请求函数模块
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 全局公用组件
│   ├── icons                  # 项目所有 svg icons
│   ├── layout                 # 全局 layout
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   ├── permission.js          # 权限管理
│   └── settings.js            # 权限管理
├── tests                      # 测试
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── .babelrc                   # babel-loader 配置
├── .travis.yml                # 自动化CI配置
├── vue.config.js              # vue-cli 配置
├── postcss.config.js          # postcss 配置
└── package.json               # package.json
```

### 1.3 跨域配置

最好的方式还是在后端使用 `cors` 解决跨域。当然前端也可以解决跨域。在 `dev` 开发模式下，前端可以使用 webpack 的 `proxy` 配置解决跨域，但是该方式生产环境是不能使用的，生产环境中需要使用 `nginx` 进行反向代理。

使用 `proxy` 配置跨域，需要在 `vue.config.js` 文件中释掉 mock 的数据，并添加 `proxy` 配置。其中的 `process.env.VUE_APP_BASE_API` 是根据开发环境在 `.env.development` 或 `.env.production` 中读取的。

```javascript
devServer: {
	port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js')
    proxy: {
      [process.env.VUE_APP_BASE_API]: { 
        target: 'http://localhost:8800',
        changeOrigin: true, // 支持跨域
        pathRewrite: { 
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
}
```

### 1.4 修改响应码

在 `src/util/request.js` 文件中需要修改响应拦截器的状态码与实际项目返回的状态码一致。

```javascript
service.interceptors.response.use(

  response => {
    const res = response.data

    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: 非法token; 50012: 其它客户端以登录; 50014: token过期;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('请求出错，已退出登录', '确定退出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
```



### 1.5 修改请求方法

在 `src/api/user.js` 文件定义了登录、获取用户信息以及退出登录的请求方法，需要根据后端提供的接口修改。

```javascript
import request from '@/utils/request'
const baseURL = '/admin/system/index'

export function login(data) {
  return request({
    url: `${baseURL}/login`,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `${baseURL}/info`,
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: `${baseURL}/logout`,
    method: 'post'
  })
}
```

下面是服务器的相关接口。

```java
@RestController
@RequestMapping("/admin/system/index")
public class IndexController {

    @PostMapping("/login")
    public Result login() {
        Map<String, Object> map = new HashMap<>();
        map.put("token","admin");
        return Result.ok(map);
    }

    @GetMapping("/info")
    public Result info() {
        Map<String, Object> map = new HashMap<>();
        map.put("roles","[admin]");
        map.put("name","admin");
        map.put("avatar","https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif");
        return Result.ok(map);
    }

    @PostMapping("/logout")
    public Result logout(){
        return Result.ok();
    }

}
```

### 1.6 修改用户名检查

在 `src/utils/validate.js` 文件中定义了用户名验证的方法。将来可根据实际需求自定义。

```javascript
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
```

在 `src/views/login/index.vue` 在进行登录验证时会使用到此方法，这里暂时改为只验证其长度。

```javascript
const validateUsername = (rule, value, callback) => {
    if (value.length<5) {
        callback(new Error('Please enter the correct user name'))
    } else {
        callback()
    }
}
```

### 1.7 配置路由

需要在 `src/router/index.js` 文件中删除多余的路由，下面是删除之后保存的路由表。

```javascript
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
```

## 二、页面配置

### 2.1 修改默认样式

vue-admin-template 与样式相关的变量都定义在 `src/styles/variable.scss` 文件中。

```scss
// sidebar
$menuText:#bfcbd9;
$menuActiveText:#409EFF;
$subMenuActiveText:#f4f4f5; 

$menuBg:#304156;
$menuHover:#263445;

$subMenuBg:#1f2d3d;
$subMenuHover:#001528;

$sideBarWidth: 210px;

:export {
  menuText: $menuText;
  menuActiveText: $menuActiveText;
  subMenuActiveText: $subMenuActiveText;
  menuBg: $menuBg;
  menuHover: $menuHover;
  subMenuBg: $subMenuBg;
  subMenuHover: $subMenuHover;
  sideBarWidth: $sideBarWidth;
}
```

### 2.2 常用配置

在 `src/settings.js` 文件中，定义了页面相关的配置。

```javascript
module.exports = {

  title: 'Vue Admin Template',

  /**
   * @type {boolean} true | false
   * @description 固定头部
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description 侧边栏显示logo
   */
  sidebarLogo: true
}
```

### 2.3 菜单设置手风琴模式

在 `src/layout/components/Sidebar/index.vue` 文件中修改如下内容。

```vue
<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item 
           v-for="route in routes" 
           :key="route.path" :item="route" 
           :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
```

### 2.4 分页组件设置中文

在 `src/main.js` 中修改如下内容

```javascript
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN' 
```

## 三、动态路由

### 3.1 方式一：基于角色的动态路由

vue-element-admin 的权限验证是基于路由表的，不同角色的用户登录后台管理系统拥有不同的菜单权限与功能权限，通过获取当前用户的角色去比对路由表，生成当前用户具有的权限可访问的路由表，通过 `router.addRoutes` 动态挂载到 `router` 上。

vue-element-admin 的路由分为两种，`constantRoutes` 和 `asyncRoutes`。`constantRoutes` 代表那些不需要动态判断权限的路由，如登录页、404、等通用页面。`asyncRoutes` 代表那些需求动态判断权限并通过 `addRoutes` 动态添加的页面。

如果要使用基于角色的动态路由渲染，则要求路由表的格式必须和下面保持一致。

```json
{
	"name": "System",
	"path": "/system",
	"component": "Layout",
	"meta": {
		"title": "系统管理",
		"icon": "user"
	},
	"children": [
        {
			"name": "User",
			"path": "user",
			"component": "system/user/index",
			"meta": {
				"title": "用户管理",
				"icon": "user",
                "roles": ['admin']
			}
		},
		{
			"name": "Role",
			"path": "role",
			"component": "system/role/index",
            "meta": {
                "title": "角色管理",
                "icon": "user",
                "roles": ['admin','user']
            }
        }
    ]
}
```

下面是具体的实现。

#### 0.后端返回的数据

后端提供的接口数据也必须符合 vue-element-admin 的规范，可以像下面这样。其中对于详情接口来说，需要为不同的用户返回不同的角色。

```json
// 登录接口数据
{"code": 200, "message": "操作成功","data": {"token": "X-admin"}}

// 注销接口数据
{"code": 200, "message": "操作成功"}

// 详情接口数据
{
    "code": 200,
    "message": "操作成功"
    "data": {
        "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        "name": "admin",
        "roles": ["admin"]
    }
}
```



#### 1. 修改路由表

操作文件：`src/router/index.js`

改造后的路由表如下：

```javascript
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  }
]

export const asyncRoutes = [
  {
    name: "System",
    path: "/system",
    component: Layout,
    meta: {
      title: "系统管理",
      icon: "user"
    },
    children: [
      { 
        name: "User",
        path: "user",
        component: () => import('@/views/system/user/index'),
        meta: {
          title: "用户管理",
          icon: "user",
          roles: ['admin']
        }
      },
      {
        name: "Role",
        path: "role",
        component: () => import('@/views/system/role/index'),
        meta: {
          title: "角色管理",
          icon: "user",
          roles: ['admin','user']
        }
      },
      {
        name: "Menu",
        path: "menu",
        component: () => import('@/views/system/menu/index'),
        meta: {
          title: "菜单管理",
          icon: "user",
          roles: ['admin','user']
        }
      }
    ]
  },
  // 404 页面必须放置在最后一个页面
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // 需要服务端支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher 
}

export default router

```

#### 2. 处理路由权限

操作文件：`src/store/modules/permission.js`

新建 permission.js 文件，用于处理动态路由的权限，文件内容如下：

```javascript
import { asyncRoutes, constantRoutes } from '@/router'

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

#### 3. 新增角色调用

操作文件：`src/store/modules/user.js`

处理用户的路由权限需要用户的角色列表，需要在 vuex 中增加。内容如下：

```javascript
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('验证失败请重新登录.')
        }

        const { name, avatar, roles } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        commit('SET_ROLES', [])
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      commit('SET_ROLES', [])
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

接着需要在 `src/store/getters.js` 中增加 roles 的调用。

```javascript
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  
  //添加roles
  roles: state => state.user.roles,
  //动态路由
  permission_routes: state => state.permission.routes,
}
export default getters
```

然后将 permission.js 添加到 `src/store/index.js`

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

//添加permission
import permission from './modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
	//添加permission
    permission
  },
  getters
})

export default store
```

最后修改根目录下的 permission.js

```javascript
import router, { constantRoutes } from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    
  NProgress.start()
  // 设置浏览器顶部标题
  document.title = getPageTitle(to.meta.title)
  // 获取token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 已经登录重定向到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户角色信息
          const { roles } = await store.dispatch('user/getInfo')
          console.log(roles)
          // 根据 roles 生产可访问的路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 动态添加可访问的路由表
          router.options.routes = constantRoutes.concat(accessRoutes)
          router.addRoutes(accessRoutes)
          
          next({ ...to, replace: true })
        } catch (error) {
          // 删除token并跳转到登录页
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
	// 没有 token 判断是否在白名单，在的话直接放行，否则跳转到登录页。
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
```

#### 4. 改变侧边栏渲染的路由表

操作文件：`src/layout/Sidebar/index.vue` 

```vue
<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item 
        v-for="route in permission_routes" 
        :key="route.path" 
        :item="route" 
        :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_routes'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
```

#### 5. 测试

admin 登录：

![image-20230329155938116](https://cdn.staticaly.com/gh/mengyahui/image-repository@master/杂项/image-20230329155938116.oiuevgjop6o.png)

user 登录：

![image-20230329160005943](https://cdn.staticaly.com/gh/mengyahui/image-repository@master/杂项/image-20230329160005943.4x4g3b2dzsa0.png)

#### 6. 实现按钮级别的权限控制

vue-element-admin 提供了一个权限判定指令，此时需要将 `src/directive/permission` 目录复制到本项目。

我们可以局部或全局注册这个指令，然后在需要权限控制的内容上使用此指令。

```vue
<template>
  <!-- Admin can see this -->
  <el-tag v-permission="['admin']">admin</el-tag>

  <!-- User can see this -->
  <el-tag v-permission="['user']">editor</el-tag>

  <!-- User can see this -->
  <el-tag v-permission="['admin','user']">Both admin or editor can see this</el-tag>
</template>

<script>
// 当然你也可以为了方便使用，将它注册到全局
import permission from '@/directive/permission/index.js' // 权限判断指令
export default{
  directives: { permission }
}
</script>
```

### 3.2 方式二：基于后端路由表的动态路由

在一些常见的 RBAC 系统中，对于角色和权限的管理是极其重要的。**一个人可以拥有多个角色，而一个角色又会被赋予多个权限**。不同的角色的用户在登录后台系统后，看到的系统菜单也是不同的。

像上面那样，前端记录所有的路由，通过角色动态控制，在角色固定的情况下可以考虑采取，如果后期要添加角色，前端路由也要跟着变化，这种方式就不合适了。

#### 0. RBAC 权限系统

在 RBAC 权限系统中，要想正确返回前端需要的路由表，数据库表的设计也必须要考虑 vue-element-admin 的路由格式。下面是一个常见的路由节点：

```json
{
    path: '/user',
    name: User,
    component: () => import('@views/user/index'),
    meta: {
        title: '用户管理',
        icon: 'user',
    },
    children: []
}
```

一个基本的路由节点，包含 `path`、`name`、`component`、`meta` 属性，如果是多级菜单，那么还需要`children`数组属性，在 `children`中又是同样属性的路由节点对象。

下面是结合路由节点和 RBAC 权限系统设计的表，省略的三个字段分别是 create_time、update_time和 is_deleted。

![image-20230330082700894](https://cdn.staticaly.com/gh/mengyahui/image-repository@master/杂项/image-20230330082700894.5qr7ezz23u00.png)

#### 1. 后端返回数据

若要根据后端路由渲染菜单，则权限信息也必须由后端提供。下面是一个后端返回的数据例子，其中 buttons 封装了用户的按钮级权限信息，menus 封装了用户的菜单权限。

```json
{
	"code": 200,
	"message": "成功",
	"data": {
		"buttons": [
			"bnt.user.list",
			"btn.user.add",
			"btn.user.update",
			"btn.user.delete",
			"btn.user.assign",
			"btn.menu.list",
			"btn.menu.add",
			"btn.menu.update",
			"btn.menu.delete"
		],
		"roles": [],
		"name": "user",
		"avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
		"menus": [
			{
				"path": "/system",
				"hidden": false,
				"component": "Layout",
				"alwaysShow": true,
				"meta": {
					"title": "系统管理",
					"icon": "el-icon-s-tools"
				},
				"children": [
					{
						"path": "user",
						"hidden": false,
						"component": "system/user/index",
						"alwaysShow": false,
						"meta": {
							"title": "用户管理",
							"icon": "el-icon-s-custom"
						},
						"children": null
					},
					{
						"path": "menu",
						"hidden": false,
						"component": "system/menu/index",
						"alwaysShow": false,
						"meta": {
							"title": "菜单管理",
							"icon": "el-icon-s-unfold"
						},
						"children": null
					}
				]
			}
		]
	}
}
```

#### 2. 修改路由表

操作文件：`src/router/index.js` 

只需要将多余的路由信息删除。

```javascript
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
```

#### 4. 新增路由和权限的调用

在 vuex 中需要在获取用户详情信息时获取菜单权限与按钮权限。

首先在 `src/store/getters.js` 中新增如下代码：

```javascript
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  buttons: state => state.user.buttons,
  menus: state => state.user.menus
}
export default getters
```

接着维护 `src/store/modules/user.js` 文件中的调用关系。

```javascript
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 路由和权限
    buttons: [],
    menus: []
  }
}

const mutations = {
 ......
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  ......
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar, buttons, menus } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_BUTTONS', buttons)
        commit('SET_MENUS', menus)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  ......
}
```

#### 5. 处理组件的导入

先在 `src/router` 目录下新建两个js文件，开发环境和生产环境导入组件的方式略有不同。

`_import_production.js`

```javascript
module.exports = file => () => import('@/views/' + file + '.vue')
```

`_import_development.js`

```javascript
module.exports = file => require('@/views/' + file + '.vue').default
```

然后再 `src/permission.js` 文件中新建一个用于将路由字符串转换为组件对象的方法。

```javascript
function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        try {
          route.component = _import(route.component)// 导入组件
        } catch (error) {
          debugger
          console.log(error)
          route.component = _import('dashboard/index')// 导入组件
        }
      }
    }
    if (route.children && route.children.length > 0) {
      route.children = filterAsyncRouter(route.children)
    } else {
      delete route.children
    }
    return true
  })
  return accessedRouters
}
```

这里的 ParentView 是在 `src/components` 下新建的，用于处理路由的多级嵌套。

`src/components/ParentView/index.vue`

```vue
<template>
	<router-view/>
</template>
```

#### 6. 动态添加路由

操作文件：`src/permissiom.js` 

在该文件的前置导航守卫中处理路由的挂载。

```javascript
import router from './router'
import store from './store'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 水平进度条提示: 在跳转路由时使用
import 'nprogress/nprogress.css' // 水平进度条样式
import getPageTitle from '@/utils/get-page-title' // 获取应用头部标题的函数
import Layout from '@/layout'
import ParentView from '@/components/ParentView'
const _import = require('./router/_import_' + process.env.NODE_ENV) // 获取组件的方法

NProgress.configure({ showSpinner: false }) 
const whiteList = ['/login'] 
router.beforeEach(async(to, from, next) => {

  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 请求获取用户信息
          await store.dispatch('user/getInfo')
          if (store.getters.menus.length < 1) {
            global.antRouter = []
            next()
          }
          // 1.过滤路由
          const menus = filterAsyncRouter(store.getters.menus)
          // 2.动态添加路由
          router.addRoutes(menus) 
          let lastRou = [{ path: '*', redirect: '/404', hidden: true }]
          router.addRoutes(lastRou)
          // 3.将路由数据传递给全局变量，做侧边栏菜单渲染工作
          global.antRouter = menus 
          next({
            ...to,
            replace: true
          })
        } catch (error) {
          console.log(error)
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else { 
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => { 
  NProgress.done()
}) 
```

最后在 `src/layout/Sidebar/index.vue`中修改侧边栏渲染的路由表。

```javascript
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      // return this.$router.options.routes
      return this.$router.options.routes.concat(global.antRouter)
    },
    ......
}
```

#### 7. 测试

admin 登录：

![image-20230330135829249](https://cdn.staticaly.com/gh/mengyahui/image-repository@master/杂项/image-20230330135829249.4xv4pfvnwfk0.png)

user 登录：

![image-20230330135853280](https://cdn.staticaly.com/gh/mengyahui/image-repository@master/杂项/image-20230330135853280.4n201aik2rg0.png)

#### 8. 实现按钮级别的权限控制

由于前端已经拿到了用户的按钮级别的权限列表，在页面中我们只需要在需要权限判定的地方判断即可。

首先，在 `src/utils` 目录下新建一个 `btn-permission.js` 文件用于判断权限。

```javascript
import store from '@/store'

/**
 * 判断当前用户是否有此按钮权限
 * 按钮权限字符串 permission 
 */
export default function hasPermission(permission) {
  // 得到当前用户的所有按钮权限
  const permissions = store.getters.buttons
  // 如果指定的功能权限在myBtns中, 返回true ==> 这个按钮就会显示, 否则隐藏
  return permissions.indexOf(permission) !== -1
}
```

然后再 `main.js` 中挂载该方法。

```javascript
import hasPermission from '@/utils/btn-permission'
Vue.prototype.$hasPermission = hasPermission
```

最后，在需要权限判定的地方使用。

```vue
<el-button type="success" :disabled="$hasPermission('btn.role.add')">添 加</el-button>
```



