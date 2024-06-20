<template>
	<div ref="chartRef" :id="id" :class="className" :style="{ height: height, width: width }"></div>
</template>

<script setup lang="ts">
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
import { LinearGradient } from 'echarts/core';

// 引入柱状图图表，图表后缀都为 Chart
import { PieChart,LineChart     } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
  ToolboxComponent,
  LegendComponent,
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import theme from "@/common/echart/style/theme";
import { onMounted, onBeforeMount, ref, watch, onUnmounted } from "vue";
// import geoJson from "@/common/echart/map/zhejiang.json";
import { markRaw } from "vue";
const props = defineProps({
	//图标唯一的id
	id: String,
	//图标的类名
	className: {
		type: String,
		default: "chart" //默认是chart
	},
	width: {
		type: String,
		require: true
	},
	// 图表高度
	height: {
		type: String,
		require: true
	},
	//上面的用于控制Echarts的样式类名 id的
	// 图表数据项
	options: {
		type: Object,
		default: () => ({})
	}
});

//结构直接拿到数值
const { id, className, height, width } = props;
const chartRef = ref(); //获取盒子的实例
const chart = ref();
// 注册必须的组件
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	LabelLayout,
	UniversalTransition,
	CanvasRenderer,
  ToolboxComponent,
  LegendComponent,
  PieChart,
  LineChart
]);
onMounted(() => {
	echarts.registerTheme("myTheme", theme); // 覆盖默认主题 可以改可以不改
	// vue3中使用proxy的方式监听响应式chart会被在vue内部转换成响应式对象，从而在resize 的时候获取不到
	//然后在在实例化echart时，将其指定为非响应式的即可
	chart.value = markRaw(echarts.init(chartRef.value, "chart")); //或者是myTheme 传入的参数

	// echarts.registerMap("zhejiang", geoJson as any); //这个是地图的json
	// echarts.registerMap("ChinaJson", ChinaJson as any); //这个是地图的json
	initChart();
});
watch(
	() => props.options,
	val => {
		val && initChart(val);
	},
	{
		deep: true
	}
);
const initChart = (data?: any, clearCaching = false) => {
	if (data || props.options) {
		chart.value!.setOption(data || props.options, clearCaching);
		window.addEventListener("resize", () => {
			chart.value?.resize();
		});
	}
};

onUnmounted(() => {
	chart.value?.dispose();
});
defineExpose({
	initChart
});
</script>

<style scoped lang="scss"></style>
