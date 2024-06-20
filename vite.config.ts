import { resolve } from 'path';
import { loadEnv,ConfigEnv, UserConfigExport } from 'vite';
import autoprefixer from 'autoprefixer';
import plugins from './plugins';
// @ts-ignore
import px2rem from 'postcss-plugin-px2rem';
import { wrapperEnv } from "./src/utils/getEnv";

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}
export default async (configEnv: ConfigEnv): Promise<UserConfigExport> => {
  const env = await loadEnv(configEnv.mode, process.cwd());
  const viteEnv = wrapperEnv(env);
  return {
    // envPrefix: 'ME_',
    server: {
      // 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
      host: "0.0.0.0",
      port:88,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // 跨域代理配置     VITE_API_URL
      proxy: {
        "/operation/cloud/wcs/client": {
          target: viteEnv.VITE_API_URL_VIDEO,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/operation\/cloud\/wcs\/client/, "")
        },
        "/operation/cloud/web/sys": {
          target: viteEnv.VITE_API_URL_web,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/operation\/cloud\/web\/sys/, "")
        },

        "/operation/cloud/oauth": {
          target: viteEnv.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/operation\/cloud\/oauth/, "")
        },
      },
    },

    plugins: await plugins(configEnv),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`,
        },
      },
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
    },
    resolve: {
      alias: [
        // /@/xxxx => src/xxxx
        {
          find: /@\//,
          replacement: pathResolve('src') + '/',
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    /* eslint-disable */
    define: {
      __SSR__: `true`,
      __DEV__: configEnv.mode === 'development' ? `true` : `false`,
      __COMPAT__: `false`,
      __FEATURE_SUSPENSE__: `true`,
      __FEATURE_PROD_DEVTOOLS__: `false`,
    },
    /* eslint-disable */
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // 打包优化
            core: [
              'vue',
              'vue-router',
              'pinia',
              'vue-request',
              'vue-i18n/dist/vue-i18n.esm-bundler.js',
              // 'jquery',
              'axios',
            ],
            elIcon: ['@element-plus/icons-vue'],
            // mock: [pathResolve('./mock')],

          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
        },
      },
    },
    optimizeDeps: {
      //因为项目中很多用到了自动引入和动态加载，所以vite首次扫描依赖项会扫描不全，这里强制扫描全局。
      entries: ['src/**/*.{ts,tsx,vue}'],
      include: [
        'element-plus/es/components/loading/style/css',
        'element-plus/es/components/message/style/css',
        'element-plus/es/components/message-box/style/css',
        'element-plus/es/components/notification/style/css',
      ],
    },
  };
};
