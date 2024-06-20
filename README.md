# 目录说明

```text
.
├── dist 打包文件夹
├── mock mock文件夹
├── plugins vite插件
├── public 公共静态资源目录
├── src  主目录
│   ├── api 接口文件
│   ├── assets 资源文件
│   │   └── images 项目存放图片的文件夹
│   ├── components 公共组件（里面的组件会自动引入）
│   ├── config 配置文件夹
│   │   ├── index.ts 配置入口文件
│   │   ├── locale.ts 国际化配置
│   │   ├── login.ts  登录配置
│   │   └── theme.ts  主题配置
│   ├── directives 指令（里面的指令会自动引入）
│   ├── dict  字典
│   ├── event 事件
|   ├── hooks 公共hooks
│   ├── icons 图标
│   │   ├── svg  svg图标文件夹（放入此文件夹的svg会被自动注册图标组件）
│   │   └── index.ts 图标自动注册入口文件
│   ├── layout 布局文件
│   ├── locales  国际化
│   │   └── lang 全局语言包
│   ├── router  路由配置
│   │   ├── guard 路由全局守卫
│   │   └── routes 动态路由存放目录
|   ├── styles 样式文件 
│   ├── store  pinia文件夹
│   ├── utils  工具类
│   ├── views  页面
│   └── main.ts 入口文件
├── template自动生成模板
├── types  类型文件
└── vite.config.ts vite
```

# 配置

## 基础配置

配置文件地址 `@/config/index.ts登录配置

登录后token会储存在在cookie中，可以在配置文件中配置token相关cookie设置

配置文件地址 `@/config/login.ts`

```typescript
export default {
  tokenName: 'HuaYi-token', // cookie中存储的token key
  tokenExpires: 7, // token 过期时间
  tokenDomain: typeof window === 'undefined' ? '' : window.location.hostname, // token 存储cookie域名
};
```

## 主题配置

配置文件地址`@/config/theme.ts`

```typescript
import { SizeEnum } from '@/enums/configEnum';
export default {
  primaryColor: '#409eff', // 主题颜色
  menuBg: '#1d1e1f', // 菜单背景颜色
  menuWidth: '200px', // 菜单展开宽度
  menuCollapse: true, // 菜单是否折叠
  size: SizeEnum.DEFAULT, // 默认大小
  fixedHeader: true, // 固定header
  topBar: true, // 是否显示顶栏
  breadcrumb: true, // 面包屑
  showDark: true, // 开启暗黑模式切换
  showSize: true, // 开启大小切换
  tagBar: true, // 标签栏
  tagBarMenu: true, // 标签栏快捷菜单
  tagBarRefresh: false, // 标签栏刷新按钮
  showSetting: true, // 展示设置按钮
};
```

## 国际化配置

配置文件地址`@/config/locale.ts`

- 语言包异步导入配置

```typescript
export const loadMessageConfig = {
// 导入语言包配置
timeOut: 10000, // 导入语言包超时时间ms(对于单次导入而不是整体导入)0代表不超时
errorWarning: false, // 导入失败的警告（生产环境会被屏蔽）
componentLoad: true, // 组件语言包导入 不需要多语言或只使用全局语言包时设置为false以提升性能
};
```

- 语言列表

注意

locale命名时需要和[element-plusopen in new window](https://element-plus.gitee.io/zh-CN/guide/i18n.html#cdn-用法)的local命名一致，否则无法加载element-plus对应的语言包

```typescript
export const localeList = [
  {
    text: '简体中文',
    locale: 'zh-cn',
  },
  {
    text: '美国英语',
    locale: 'en',
  },
]
```

- 全局[VueI18nopen in new window](https://vue-i18n.intlify.dev/api/general.html#i18noptions)初始参数(VueI18n版本基于v9.x)

注意

legacy和globalInjection无需设置 程序内部强制把legacy设置为了false、globalInjection设置为了true。

```typescript
const localeSetting: I18nOptions = {
  // Locale
  locale: localeList[0].locale,
  // Default locale
  fallbackLocale: localeList[0].locale,
  missingWarn: false, // 当本地化失败时，压制输出的警告
  fallbackWarn: false, // 抑制回落警告
  fallbackFormat: true, // 跳过为你的"base"语言编写模板;key是您的模板
};
```

# 路由菜单

这里的路由分为两种，constantRoutes 和 asyncRoutes。

constantRoutes： 代表那些不需要动态判断权限的路由，如登录页、404、等通用页面。

asyncRoutes： 代表那些需求动态判断权限并通过 addRoutes 动态添加的页面。

## 静态路由(constantRoutes)

静态路由定义位于`@/router/routes/index.ts`文件下，除了不经过权限过滤外其余规则和[**动态路由定义**](https://meadmin-cn.gitee.io/meadmin-template-doc/guide/route.html#动态路由定义)规则一样

## 动态路由(asyncRoutes)

- **动态定义分为前端定义、通过api接口获取两种。**
- **动态路由会经过权限过滤后动态注册到vue-router中。**
- **动态路由注册时会自动注册到一级路由`/`的children下,这样菜单路由只有一级也可以渲染出layout框架**

路由功能基于[vue-routeropen in new window](https://router.vuejs.org/zh/introduction.html)开发,自定义配置放在了[meta](https://meadmin-cn.gitee.io/meadmin-template-doc/guide/route.html#meta配置说明)中,其余定义规则参考[vue-router#routerecordrawopen in new window](https://router.vuejs.org/zh/api/#routerecordraw)。

### 动态路由前端定义模式

将`settingConfig.menuMode`(位于`@/config/index.ts`文件中)设置为`MenuModeEnum.STATIC`，将使用前端定义模式。

在前端定义模式下，`@/router/routes`文件夹下的所有.ts文件会被自动加载并经过权限过滤后动态注册到vue-router中。

注意

- 只会动态注册`@/router/routes`文件夹下的.ts文件 不会注册其子文件夹的.ts文件。
- 路由注册顺序会根据文件名按**字符串顺序**进行注册，建议文件命名时加上`数字-`前缀以明确菜单顺序。
- 默认只有一个children的菜单会省略父级菜单。
- component说明：目录路由使用`Layout`,最低级路由使用自己的view组件。

#### 定义示例

- **单文件路由注册示例**

1. 二级路由示例

```typescript
import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
export const routes: RouteRecordRaw[] = [
  {
    path: '/example',
    component: Layout,
    children: [
      {
        path: '/example/test',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: 'test示例'},
      },
    ],
    meta: { title: '示例', icon: 'mel-icon-promotion' },
  },
];
```

1. 多级路由示例

```typescript
import { RouteRecordRaw, RouterView } from 'vue-router';
import { Layout } from '@/router/constant';
export const routes: RouteRecordRaw[] = [
  {
    path: '/example',
    component: Layout,
    children: [
       {
          path: '1',
          component: LayoutPage,
          meta: { title: '多级菜单1' },
          children: [
            {
              path: '1-1',
              component: LayoutPage,
              meta: { title: '多级菜单1-1', alwaysShow: true },
              children: [
                {
                  path: '1-1-1',
                  component: () => import('@/views/dashboard/index.vue'),
                  meta: { title: '多级菜单1-1-1' },
                },
                {
                  path: '/test/componentLang',
                  component: async () => await import('@/views/example/componentLang/index.vue'),
                  meta: { title: '组件语言包' },
                },
              ],
            },
            {
              path: '1-2',
              component: () => import('@/views/dashboard/index.vue'),
              meta: { title: '多级菜单1-2' },
            },
          ],
        },
    ],
    meta: { title: '示例', icon: 'mel-icon-promotion' },
  },
];
```

- **文件+文件夹组合注册示例**

父级路由`@/router/routes/example.ts`

```typescript
import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { concatObjectValue } from '@/utils/helper';
export const routes: RouteRecordRaw[] = [
  {
    path: '/example',
    component: Layout,
    children: concatObjectValue<RouteRecordRaw>(import.meta.glob('./example/*.ts', { eager: true, import: 'routes' })),
    meta: { title: '示例', icon: 'mel-icon-promotion' },
  },
];
```

子路由 `@/router/routes/example/1-test.ts`

```typescript
import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: '/example/test',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { title: 'test示例'},
  },
];
```

### 动态路由api获取模式

将`settingConfig.menuMode`(位于`@/config/index.ts`文件中)设置为`MenuModeEnum.API`，将使用api模式。

在api模式下，登录成功后或者已登录首次访问时，会通过调用接口获取菜单数组，经权限过滤后动态注册到vue-router中。

#### api调用代码

```typescript
//src/store/modules/route.ts
async generateRoutes() {
  if (useUserStore().rules) {
    switch (settingConfig.menuMode) {
      case MenuModeEnum.STATIC:
        this.addRoutes = markRaw(filterAsyncRoutes(asyncRoutes));
        break;
      case MenuModeEnum.API://代表api模式
        initDynamicViewsModules();//注册视图文件modules
        this.addRoutes = markRaw(filterAsyncRoutes(await menuApi()(), undefined, true));//通过接口获取菜单路由定义，可修改menuApi,改为自己的api调用函数。
        break;
    }
  }
  return this.addRoutes;
}
//src/api/routeMenu.ts
//获取路由菜单的api请求定义，可以修改为自己的地址
export function menuApi(returnAxios = true) {
  return request<RouteRecordRaw[], [], typeof returnAxios>(
    () => ({
      url: Api.MENU,
      method: 'get',
    }),
    {},
    returnAxios,
  );
}
```

#### 路由菜单接口返回示例

- 除了`component`为string,其余字段和格式均和路由定义规则相同,详细请参考[vue-router#routerecordrawopen in new window](https://router.vuejs.org/zh/api/#routerecordraw)。
- 默认只有一个children的菜单会省略父级菜单。
- component说明：目录路由使用`Layout`,最低级路由使用相对于`src/views`目录的相对地址(不可携带后缀，会自动添加.vue、.tsx进行匹配)。

```typescript
[
  {
    path: '/index',
    redirect: '/index/index',
    component: 'Layout',
    children: [
      {
        path: 'index',
        component: 'dashboard/index',
        meta: {
          title: '首页',
          affix: true,
          icon: 'me-icon-dashboard',
        },
      },
    ],
    meta: {
      title: '',
    },
  },
  {
    path: '/example',
    component: 'Layout',
    children: [
      {
        path: 'permission',
        component: 'example/permission',
        meta: {
          title: '权限',
        },
      },
      {
        path: 'componentLang',
        component: 'example/componentLang/index',
        meta: {
          title: '组件语言包',
        },
      },
      {
        path: 'request',
        component: 'example/request',
        meta: {
          title: '请求示例',
        },
      },
      {
        path: 'https://github.com/meadmin-cn/meadmin-template',
        component: '404',
        meta: {
          title: '外链',
          isLink: true,
        },
      },
      {
        path: 'pagePermission',
        component: 'example/pagePermission',
        meta: {
          title: '页面权限',
          rule: ['edit'],
        },
      },
      {
        path: 'multilevel',
        component: 'Layout',
        meta: {
          title: '多级菜单',
        },
        children: [
          {
            path: '1',
            component: 'Layout',
            meta: {
              title: '多级菜单1',
            },
            children: [
              {
                path: '1-1',
                component: 'Layout',
                meta: {
                  title: '多级菜单1-1',
                  alwaysShow: true,
                },
                redirect: '/example/multilevel/1/1-1/1-1-1',
                children: [
                  {
                    path: '1-1-1',
                    component: 'dashboard/index',
                    meta: {
                      title: '多级菜单1-1-1',
                    },
                  },
                  {
                    path: '/test/componentLang',
                    component: 'example/componentLang/index',
                    meta: {
                      title: '组件语言包',
                    },
                  },
                ],
              },
              {
                path: '1-2',
                component: 'dashboard/index',
                meta: {
                  title: '多级菜单1-2',
                },
              },
            ],
          },
        ],
      },
    ],
    meta: {
      title: '示例',
      icon: 'mel-icon-promotion',
    },
  },
]
```

### Meta配置说明

```text
export interface RouteMeta extends Record<string | number | symbol, unknown> {
    // 标题设置该路由在侧边栏和面包屑中展示的名字
    title: string;
    // 对应权限 多个之间为或的关系
    rule?: string[];
    // 是否是固定的tag
    affix?: boolean;
    // 图标
    icon?: string;
    // 在tag中隐藏
    hideTag?: boolean;
    // 外链
    isLink?: boolean;
    // 当路由设置了该属性，则会高亮相对应的侧边栏。
    // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
    // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
    // asyncRoutes如果不设置会自动计算展示不隐藏的祖级（包括当前）
    activeMenu?: string;
    // 如果设置为true，则不会被 <keep-alive> 缓存
    noCache?: boolean;
    // 在菜单中隐藏
    hideMenu?: boolean;
    // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式
    // 只有一个时，会将那个子路由当做根路由显示在侧边栏
    // 若你想不管路由下面的 children 声明的个数都显示你的根路由
    // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
    alwaysShow?: boolean;
    // 是否需要面包屑 false不展示在面包屑,ture一直展示在面包屑,undefined当只有一个子元素面包屑时跳过展示
    breadcrumb?: boolean;
  }
```

### 外链

将路由的path设置为外链地址 `meta.isLink`设置为`true` 即可设置外链

```text
import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'https://github.com/meadmin-cn/meadmin-template',
    component: async () => await import('@/views/404.vue'),
    meta: { title: '外链', isLink: true },
  },
];
```

### 路由权限

路由权限定义字段为`meta.rule`,`meta.rule`接收一个字符串数组，当用户匹配成功权限数组中的任意一个元素,会注册此路由，不设置`meta.rule`表示，此路由无需权限校验。

```text
import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'pagePermission',
    component: async () => await import('@/views/example/pagePermission.vue'),
    meta: { title: '页面权限', rule: ['edit'] },
  },
];
```

### 菜单图标

菜单图标通过`meta.icon`定义值为图标组件的name,自定义svg图标和使用elment-plus图标请参考[图标](https://meadmin-cn.gitee.io/meadmin-template-doc/guide/icon.html)

### keepAlive缓存

页面缓存通过 组件[me-keep-alive]实现,通过路由的fullPath进行缓存过滤，所以无需对页面组件设置name,即可进行缓存，并且多路由共用同一页面组件时，可以进行独立刷新，互不影响。

- 如果想全局禁用keppAlive，去`@/config/index.ts`配置`settingConfig.openKeepAlive`为`false`即可，配置详情参见[config）
- 如需设置某个路由不缓存设置`meta.noCache`值为`true`即

# 权限

## 初始化权限

当登录成功或刷新页面后，会请求`/api/user/info`接口获取权限，相关代码在`@/store/modules/user.ts`中,`rules`值为用户具有的权限数组，格式为`string[]`。

```typescript
// 初始化
init: async function (tokenValue?: string) {
    const token = tokenValue ?? cookies.get(config.tokenName);
    if (token) {
    this.token = token;
    this.user = await userInfoApi(true)();
    this.rules = this.user.rules;
    useRouteStore()
        .generateRoutes()
        .forEach((route) => router.addRoute(route));
    } else {
    this.token = '';
    }
},
```

## 路由权限校验

初始化完权限后，根据获取到的权限动态过滤`asyncRoutes`,并注册过滤后的路由，过滤规则参考[路由权限](https://meadmin-cn.gitee.io/meadmin-template-doc/guide/route.html#路由权限)

## 按钮权限校验

权限校验函数为permission(rules?: string | string[])，当入参为数组时，匹配成功数组中的任意一个权限则返回true。

通过v-if指令和permission函数配合进行按钮权限校验(未进行封装指令的原因是，指令方式对服务端渲染不友好，建议使用v-if判断)。

- 通过全局函数$permission()校验权限

```vue
    <el-button v-if="$permission('edit')">{{ $t('编辑') }}</el-button>
```

- 引入 permission()函数校验

```vue
<template>
  <div class="permission">
    <el-button v-if="permission('show')">{{ $t('查看') }}</el-button>
  </div>
</template>
<script setup lang="ts" name="permission">
import { permission } from '@/utils/permission';
</script>
```

## 超管权限

当初始化权限时拿到的`rules`数组包含'*'时，代表具有所有权限，权限permission函数会必定返回`true`

# 图标

## 自定义svg图标

svg图标的存放目录为`@/src/icons/svg`，该文件夹下.svg结尾的文件会被自动注册为图标组件，组件名为`me-icon-{name}`

## 使用elment-plus图标

elment-plus图标默认已全局注册，注册组件名为`mel-icon-{name}`,elment-plus图标完整列表请参考[elment-plus文档open in new window](https://element-plus.org/zh-CN/component/icon.html#图标集合)

## 组件props

图标组件接受两个props：size、color

| props | 类型          | 说明            |
| ----- | ------------- | --------------- |
| size  | string/number | 图标的fontSize  |
| color | string        | 图标的color属性 |

# 国际化

- 详细配置说明请参考[国际化配置]
- 国际化基于[vue-i18n v9.xopen in new window](https://kazupon.github.io/vue-i18n/zh/introduction.html)开发。具体翻译规则请参考[vue-i18n v9.x 文档open in new window](https://kazupon.github.io/vue-i18n/zh/introduction.html)

## 设置语言列表

在配置文件`@/config/locale.ts`设置语言选项，新增成功后`localeList`里面的`text`会展示在语言切换的下拉列表中,如果`localeList`只有一个元素则不会展示切换语言按钮

注意

locale命名时需要和[element-plusopen in new window](https://element-plus.gitee.io/zh-CN/guide/i18n.html#cdn-用法)的local命名一致，否则无法加载element-plus对应的语言包

```typescript
export const localeList = [
  {
    text: '简体中文',
    locale: 'zh-cn',
  },
  {
    text: '美国英语',
    locale: 'en',
  },
]
```

## 设置默认语言

修改配置文件`@/config/locale.ts`中的`localeSetting.locale`的值为`localeList`任一元素的`locale`来配置初始语言

## 全局语言包

### 添加全局语言包

全局语言包位于`@/locales/lang`文件夹下，下面以新建en对应语言包为例：

- 在`@/locales/lang`文件夹下新建文件夹`en`(文件夹名要和`locale`名称一致)

```bash
  cd ./locales/lang
  mkdir en
```

- 在`@/locales/lang/en`文件夹中新建`index.ts`文件并写入以下代码

```typescript
import { forOwn } from 'lodash-es';
const modules = import.meta.glob('./**/*.{json,ts}', { eager: true, import: 'default' });
const langs = {} as Record<string, string>;
forOwn(modules, (value) => {
  Object.assign(langs, value);
});
export default langs;
```

- 在`@/locales/lang/en`文件夹下新建任意`json/ts`语言包文件,语言系统会自动加载

注意

- 非必要优先使用json格式语言包(有利于自行修改为VueI18nPlugin生成预加载包)。

```
//@/locales/lang/en/menu.json
{
  "首页": "Index",
  "示例": "Example",
  "权限": "Permission",
  "组件语言包": "Component Language Pack",
  "请求示例": "Request Example",
  "页面权限": "Page Permission",
  "多级菜单": "Multilevel Menu",
  "多级菜单1": "Multilevel Menu 1",
  "多级菜单1-1": "Multilevel Menu 1-1",
  "多级菜单1-1-1": "Multilevel Menu 1-1-1",
  "多级菜单1-2": "Multilevel Menu 1-2"
}
```

### 规范使用

```vue
<template>
  <div>
    {{ $t('多级菜单1') }}
    <br />
    {{ $t('权限') }}
  </div>
</template>
```

## 组件语言包

### 添加组件语言包

假设组件目录结构如下

```text
├── componentLang 组件文件夹
│   └── index.vue 组件vue文件
```

- 在`componentLang`文件夹下新建组件语言包文件夹`lang`(组件语言包文件夹名必须为`lang`)

```bash
 mkdir lang
```

- 在`componentLang/lang`文件夹下建立对应语言`json/ts`文件，文件名和`localeList`里面的`local`值相同,以`en`语言举例

注意

- 非必要优先使用json格式语言包(有利于自行修改为VueI18nPlugin生成预加载包)。

```text
  touch en.json
```

- 在语言文件中写入翻译内容

```json
{
  "切换语言查看效果": "Switch languages to see the effect",
  "打开Network可以看到语言包请求": "Open Network to see the language pack request"
}
```

### 使用组件语言包

- 引入

  1. 如果你用的`<script setup lang="ts">`直接在`<script setup>`加入语言包引入即可(此功能基于[vueSetupExtend插件open in new window](https://github.com/yuntian001/vue-setup-extend)实现)

  注意

  - `useLocalesI18n`函数的第二个参数`[(locale: string)=> import(`./lang/${locale}.json`), 'compnentLang']`必须使用[]的方式声明数组，如果使用Array()或者变量传参vite插件`vueSetupExtend`不会自动生成`langImport`属性,此时可在`<script setup lang="ts">`标签中显示声明`langImport`

  ```vue
  <script setup lang="ts" langImport="{{Array((locale) => import(`./lang/${locale}.json`), 'compnentLang')}}">
  ```

  - `[(locale: string) => import(`./lang/${locale}.json`), 'compnentLang']` 中的 `compnentLang`为组件语言包的缓存名称，确保同一语言(locale)下每个组件语言包一一对应。

  ```vue
  <script setup lang="ts">
  import { useLocalesI18n } from '@/locales/i18n';
  const { t } = useLocalesI18n({}, [(locale: string) => import(`./lang/${locale}.json`), 'compnentLang']);
  </script>
  ```

  1. 如果你使用的`<script lang="ts">`或者`vue`文件中同时存在`<script lang="ts">`和`<script lang="ts">`则`<script lang="ts">`需要额外声明langImport属性以让语言系统切换路由时提前加载语言包

  ```vue
  <script lang="ts">
  import { useLocalesI18n } from '@/locales/i18n';
  import { defineComponent } from 'vue'
  export default defineComponent({
    langImport:[(locale: string) => import(`./lang/${locale}.json`), 'compnentLang'],
    setup(props) {
      const { t } = useLocalesI18n({}, [(locale: string) => import(`./lang/${locale}.json`), 'compnentLang']);
      return t;
    }
  })
  </script>
  ```

- `template`中按[vue-i18n v9.xopen in new window](https://kazupon.github.io/vue-i18n/zh/introduction.html)规范使用即可

```vue
<template>
  <div class="component-lang">
    {{ t('切换语言查看效果') }}
    <br />
    {{ t('打开Network可以看到语言包请求') }}
  </div>
</template>
```

### 优化建议

- 建议翻译key值为初始化语言的值，这样能节省对应语言包的编写。
- 如果您的语言包数据不大或用不到多语言建议将翻译全部放在全局语言包中，在配置文件`@/config/locale.ts`中设置`loadMessageConfig.componentLoad`的值为`false`,以避免切换路由时的语言包请求，优化性能。

# 式

本系统样式采用的 [sassopen in new window](https://www.sass.hk/)，建议全局样式和变量放在 公共样式文件夹 中，组件样式写在各自组件的`<style lang="scss" scoped>`标签中，请提前了解 [sassopen in new window](https://www.sass.hk/) 和 [vue cssopen in new window](https://cn.vuejs.org/api/sfc-css-features.html)文档

## 公共样式文件夹

```text
├── src  
|   ├── styles 公共样式文件
│   │   ├── element-plus.scss element-plus覆盖样式
│   │   ├── index.scss 全局样式
│   │   ├── transition.scss 动画样式
│   │   └── variables.scss  sass变量
```

## sass变量

sass 变量位于 `src/styles/variables.scss`文件中，已用`vite`的`css.preprocessorOptions.scss.additionalData`配置项自动引入，`vue`的模板中可直接使用

### 使用示例

```text
<style lang="scss" scoped>
.main {
  padding: $page-padding;
}
</style>
```

## size切换

为了实现size 的切换功能，做了以下更改

- 修改large、small下的--el-font-size-base，代码位置位于`src/styles/element-plus.scss`

```scss
.me-large:root {
  //这里强制将font-size-base设置为large
  --el-font-size-base: var(--el-font-size-large);
}
.me-small:root {
  //这里强制将font-size-base设置为small
  --el-font-size-base: var(--el-font-size-small);
}
```

- 不同size下 html基础`font-size`不同,代码位置位于`src/styles/index.scss`

```scss
.me-large {
  font-size: var(--el-font-size-base);
}

.me-default {
  font-size: var(--el-font-size-base);
}

.me-small {
  font-size: var(--el-font-size-small);
}
```

- 将`font-size`的值由`px`自动转化为`rem`,实现代码位于`vite.config.ts`

```typescript
postcss: {
    plugins: [
        autoprefixer,
        px2rem({
        rootValue: 14, //换算基数，将 px 替换为 1/rootValue rem (即设计图下的fontSize)
        // unitPrecision: 5, //允许REM单位增长到的十进制数字。
        propWhiteList: ['font-size'], //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
        // propBlackList: ['font-size', 'border'], //不应从 px 更改为 rem 的属性
        exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
        // selectorBlackList: [], //要忽略并保留为px的选择器
        // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
        // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
        mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
        minPixelValue: 2, //设置要替换的最小像素值(包含)。 默认 0
        }),
    ],
},
```

# 组件自动按需引入

组件自动引入功能基于[vite-plugin-autogeneration-import-fileopen in new window](https://github.com/yuntian001/vite-plugin-autogeneration-import-file)、[unplugin-vue-componentsopen in new window](https://github.com/antfu/unplugin-vue-components)插件实现，相关配置说明请参考对应文档

## elment-plus组件自动引入

直接在vue文件中使用elment-plus组件，编译时会自动按需引入。 使用示例：

```text
<template>
  <el-dropdown class="me-size-select" trigger="click" max-height="500px">
    <div class="flex-center pointer">
      <me-icon-size class="icon"></me-icon-size>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in SizeEnum"
          :key="item"
          :disabled="themeConfig.size === item"
          @click="themeConfig.size = item"
          >{{ $t(item) }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts" name="meSize">
import { SizeEnum } from '@/enums/configEnum';
import { useSettingStore } from '@/store';
const { themeConfig } = useSettingStore();
</script>
<style lang="scss" scoped>
.me-size-select {
  .flex-center {
    padding: 0 10px;

    .icon {
      font-size: 1.2em;
    }
  }
}
</style>
```

## 公共组件自动按需引入

- 在`@/components`文件夹下符合`['*.vue', '**/index.{vue,ts}']` `glob`规则的文件会被自动识别为公共组件，在使用时可直接使用，编译时会自动引入，组件名规则为相对于`@/components`并去除结尾的(index、Index)的大驼峰名称，最终名称可去类型声明文件中确认。
- 公共组件会自动创建类型声明，类型声明文件位于`types/components.d.ts`。

使用示例

```text
<template>
  <div class="header">
    <me-dark-switch v-if="themeConfig.showDark"></me-dark-switch>
    <me-size-select v-if="themeConfig.showSize"></me-size-select>
    <me-locale-select v-if="localeConfig.localeList.length > 1"></me-locale-select>
  </div>
</template>
<script setup lang="ts" name="Header">
import { localeConfig } from '@/config';
import { useSettingStore } from '@/store';
const { themeConfig } = useSettingStore();
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 12px;
}
</style>
```

## 自定义引入规则

自动引入规则可在`plugins/autoImport.ts`中可自行配置更改，详细说明请参考[vite-plugin-autogeneration-import-file文档open in new window](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/blob/main/README-zh-cn.md) 核心代码如下

### 规则核心代码

```
plugins/autoImport.ts
import { dirname, resolve } from 'path';
import * as fs from 'fs';
import { createPlugin } from 'vite-plugin-autogeneration-import-file';
import { fileURLToPath } from 'url';
const { autoImport, resolver: resolverFn } = createPlugin();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function pathResolve(dir: string) {
  return resolve(__dirname, '../', dir);
}
export default () =>
  autoImport([
    // 自动生成
    {
      // svg icon type
      pattern: ['*.svg'],
      dir: pathResolve('src/icons/svg'),
      toFile: pathResolve('types/meIconComments.d.ts'),
      name: 'MeIcon_{{name}}',
      template: fs.readFileSync(pathResolve('./template/meIconComments.d.ts'), 'utf-8'),
      codeTemplates: [{ key: '//code', template: '{{name}}: Icon;\n    ' }],
    },
    {
      // pinia module
      pattern: ['**/*.{ts,js}', '*.{ts,js}'],
      dir: pathResolve('src/store/modules'),
      toFile: pathResolve('src/store/module.ts'),
      name: 'use_{{name}}_store',
    },
    {
      // auto import directives
      pattern: ['*.ts', '**/index.ts'],
      dir: pathResolve('src/directives'),
      toFile: pathResolve('types/directives.d.ts'),
      template: fs.readFileSync(pathResolve('./template/directives.d.ts'), 'utf-8'),
      codeTemplates: [
        {
          key: '//code',
          template: '{{name}}: typeof import("{{path}}")["default"];\n    ',
        },
      ],
      name: 'V_{{name}}',
    },
    {
      // auto import components
      pattern: ['*.{vue,ts}', '**/index.{vue,ts}'],//具体文件规则，当前规则为 dir文件夹下的.vue或.ts 或者dir子文件夹下的index.vue或index.ts文件
      dir: pathResolve('src/components'),//扫描的文件夹
      toFile: pathResolve('types/components.d.ts'),//生成的type文件位置
      template: fs.readFileSync(pathResolve('./template/components.d.ts'), 'utf-8'),//生成文件模板
      codeTemplates: [ //生成代码替换模板
        {
          key: '//code',
          template: '{{name}}: typeof import("{{path}}")["default"];\n    ',
        },
        {
          key: '//typeCode',
          template: 'type {{name}}Instance = InstanceType<typeof import("{{path}}")["default"]>;\n  ',
        },
      ],
      name: '_{{name}}',//组件名称命名模板
    },
  ]);

export const resolver = resolverFn;
```

### 自动引入核心代码

```
plugins/autoComponents.ts
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { resolver } from './autoImport';
export default () =>
  // 组件自动注册核心代码
  Components({
    include: [],
    dts: false,
    //resolver函数的第一个数组参数代表组件自动引入的规则index,第二个数组参数代表指令自动引入的规则index
    resolvers: [ElementPlusResolver({ importStyle: false }), resolver([3], [2])],
  });
```

# Pinia使用

Pinia 是 下一代 Vue 的存储库，相关使用说明请参考[Piniaopen in new window](https://pinia.web3doc.top/introduction.html)文档

## 新建store文件

store存放文件夹为`@/store/modules`，在store文件夹下新建对应store文件，按[Piniaopen in new window](https://pinia.web3doc.top/introduction.html)规则声明`defineStore`函数并导出为`default`即可

示例：

```text
import { filterAsyncRoutes } from '@/utils/permission';
import useUserStore from './user';
import { constantRoutes, asyncRoutes } from '@/router';
import { RouteRecordRaw } from 'vue-router';

export default defineStore('route', {
  state: () => ({
    addRoutes: [] as RouteRecordRaw[],
    noCacheFullPath: [] as Array<string | RegExp>,
  }),
  getters: {
    routes: (state) => constantRoutes.concat(state.addRoutes),
  },
  actions: {
    generateRoutes() {
      if (useUserStore().rules) {
        this.addRoutes = markRaw(filterAsyncRoutes(asyncRoutes));
      }
      return this.addRoutes;
    },
    setNoCache(fullPath: string) {
      if (!this.noCacheFullPath.includes(fullPath)) {
        this.noCacheFullPath.push(fullPath);
      }
    },
    removeNoCache(fullPath: string) {
      const index = this.noCacheFullPath.indexOf(fullPath);
      if (index > -1) {
        this.noCacheFullPath.splice(index, 1);
      }
    },
  },
});
```

## 导出语句自动生成

- 在`@/store/modules`文件夹下符合`['**/*.{ts,js}', '*.{ts,js}']` `glob`规则的文件会在`@/store/module.ts`文件中自动创建对应导出语句

说明

此功能基于[unplugin-vue-componentsopen in new window](https://github.com/antfu/unplugin-vue-components)插件实现,对应配置位于`vite.config.ts`中

```text
//当前文件由vite-plugin-autogeneration-import-file自动生成
export { default as useGlobalStore } from "./modules/global"
export { default as useRouteStore } from "./modules/route"
export { default as useSettingStore } from "./modules/setting"
export { default as useUserStore } from "./modules/user"
//code
```

- `@/store/index.ts`文件对`@/store/module.ts`文件进行了二次导出

```text
export * from './module';
```

## 使用store

直接导入后使用即可,具体规则请参考[Piniaopen in new window](https://pinia.web3doc.top/introduction.html)文档

```text
import { useUserStore } from '@/store';
const userStore = useUserStore();
```

# pi自动引入

基于[unplugin-auto-importopen in new window](https://github.com/antfu/unplugin-auto-import)的api自动引入，支持`vue` `vue-router` `pinia` `@vueuse/core`更多说明参考[unplugin-auto-importopen in new window](https://github.com/antfu/unplugin-auto-import)文档

配置代码位置`vite.config.ts`

```typescript
AutoImport({
    // 自动加载API
    imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
    // 可以选择auto-imports.d.ts生成的位置，使用ts建议设置为'src/auto-imports.d.ts'
    dts: 'types/auto-imports.d.ts',
    resolvers: [ElementPlusResolver()],
}),
```

**无需**

```typescript
import { computed, ref } from 'vue'
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

**直接**

```typescript
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

# 开发规范

## eslint

本项目配置有`eslint`规范，具体规则位于`.eslintrc.cjs`文件中，

- 校验代码规范

```text
    npm run eslint
```

- 校验并修复

```text
    npm run eslint:fix
```

## prettier

本项目配置有`prettier`代码格式化规则，具体配置位于`.prettierrc.cjs`中。

- 校验代码格式规范

```text
    npm run prettier
```

- 校验并修复格式规范

```text
    npm run prettier:fix
```

## git提交规范[conventionalcommitsopen in new window](https://www.conventionalcommits.org/en/v1.0.0/)

- 本项目的git提交规范遵循[conventionalcommitsopen in new window](https://www.conventionalcommits.org/en/v1.0.0/)并进行了自定义配置，具体配置规则如下

```text
"types": [
    {
    "type": "feat",
    "section": "新功能[feat]"
    },
    {
    "type": "fix",
    "section": "Bug 修复[fix]"
    },
    {
    "type": "chore",
    "section": "其他[chore]"
    },
    {
    "type": "docs",
    "section": "文档更改[docs]"
    },
    {
    "type": "style",
    "section": "样式更改[style]"
    },
    {
    "type": "refactor",
    "section": "重构[refactor]"
    },
    {
    "type": "perf",
    "section": "性能改进[perf]"
    },
    {
    "type": "test",
    "section": "测试添加/更正[test]"
    },
    {
    "type": "revert",
    "section": "还原提交[revert]"
    },
    {
    "type": "ignore",
    "section": "需要忽略[ignore]",
    "hidden": true
    },
    {
    "type": "ci",
    "section": "CI发版[ci]"
    }
]
```

- 如果使用`vscode`编辑器，建议安装[Conventional Commitsopen in new window](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits)插件,此插件会自动生成对应格式提交日志

## husky自动化

1. 安装时不使用`npm install`直接使用`npm run i `,或者初始化后在当前目录下运行`npx husky install`

2. 或者在 package.json加入以下

   ```
   scripts
   ```

   再install (

   husky对应文档open in new window

   )

   ```text
   //npm/pnpm
   {
        "scripts": {
            "prepare": "husky install"
        }
    }
   ```

   ```text
   //yarn
    {
    "private": true, // ← your package is private, you only need postinstall
    "scripts": {
        "postinstall": "husky install"
    }
    }
   ```

会自动生成生成`husky`对应的git hook`husky`会在git提交时进行以下操作:

- 自动运行`prettier --write`进行代码格式化
- 自动运行`eslint --cache --fix`进行`eslint`校验和修复,如果无法修复会报错并停止提交
- 自动校验提交`message`是否符合`conventionalcommits`规范，如果不符合会报错并停止提交

### husky 在linux/mac下不生效

husky目前有一个bug, windows下创建的hooks 当在linux/macos下拉取后即使执行了`husky install`也不能成功调用，需要单独执行下`chmod ug+x .husky/*` 赋予脚本执行权限。对应的[issue](https://github.com/typicode/husky/issues/1177)
