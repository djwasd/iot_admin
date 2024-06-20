import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {message} from "@/utils/components/message";
import {useRouter} from "vue-router";
const router = useRouter();

const request = axios.create({
	baseURL:  '',
	// baseURL: import.meta.env.VITE_USER_NODE_ENV === 'production' ? '/operation/cloud' : '',

	timeout: 5000
});
const not_header = [
	"/operation/cloud/oauth/api/oauth/actions/login",
	"/operation/cloud/web/sys/api/user/register"
];

// 添加请求拦截器
request.interceptors.request.use(
	(config: AxiosRequestConfig | any) => {
		// 在发送请求之前做些什么
		if (!not_header.includes(config.url)) {
			const date =JSON.parse(localStorage.getItem('user'))
			if (date.token) {
				config.headers.Authorization = `Bearer ${date.token}`; // 将token添加到请求头
			}
		}
		return config;
	},
	function (error) {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
request.interceptors.response.use(
	(response: AxiosResponse | any) => {
		return response;
	},
	function (error) {
		console.log(error.response.status,'--error')
		if (error.response.status ===502){
			message('服务器未开启',{type:'error'})
		}else  if (error.response.status ===500){
			 router.replace('/login');

		}
		// 对响应错误做点什么
		return Promise.reject(error);
	}
);

export default request;
