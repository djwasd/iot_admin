import { SizeEnum } from '@/dict/configEnum';
export default {
  primaryColor: '#409eff', // 主题颜色
  menuType: 'top' as 'sidebar' | 'top', //菜单模式，顶部模式/侧边栏模式
  menuBg: '#ffffff', // 菜单背景颜色
  menuWidth: '200px', // 菜单展开宽度
  menuCollapse: true, // 菜单是否折叠
  size: SizeEnum.DEFAULT, // 默认大小
  fixedHeader: true, // 固定header
  topBar: true, // 是否显示顶栏
  breadcrumb: true, // 面包屑
  showDark: false, // 开启暗黑模式切换
  showSize: false, // 开启大小切换
  tagBar: true, // 标签栏
  tagBarMenu: true, // 标签栏快捷菜单
  tagBarRefresh: false, // 标签栏刷新按钮
  showSetting: false, // 展示设置按钮
  showSearchMenu: true, //菜单搜索
};
