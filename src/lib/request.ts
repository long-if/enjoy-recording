import axios, { AxiosInstance, AxiosResponse } from "axios";
import qs from "qs";
import { useStorage } from "@vueuse/core";
import EventEmitter from "./EventEmitter";
const router = useRouter();

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: "http://localhost:7001/api/",
    timeout: 2 * 60 * 1000,
    headers: { "Content-Type": "application/json" },
    paramsSerializer: {
        serialize(params) {
            return qs.stringify(params, { allowDots: true });
        },
    },
});

// 添加请求拦截器
service.interceptors.request.use(
    (config: any) => {
        // 在发送请求之前做些什么 token
        const token = useStorage("token", "");
        if (token.value) {
            //不通过json会多带一个双引号
            config.headers!["Authorization"] = `Bearer ${token.value}`;
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    function (response) {
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        return response;
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
		if (error.response.status === 409)  {
			EventEmitter.emit("conflict")
			return Promise.reject(error.response.data.message);
		}
        return Promise.reject(error);
    }
);

// 导出 axios 实例
export default service;
