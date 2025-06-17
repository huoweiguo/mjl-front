// 配置axios
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const instance = axios.create({
  baseURL: '/',
  timeout: 10000
})
// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    //  获取请求头
    const headers = config.headers || {}
    // 向请求头添加token
    headers['Authorization'] = 'token'
    config.headers = headers
    return config
  },
  (error: AxiosError) => {
    // 处理请求错误
    return Promise.reject(error)
  }
)
// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据进行处理
    return response
  },
  (error: AxiosError) => {
    // 处理响应错误
    return Promise.reject(error)
  }
)

// 导出axios请求方法
// GET
// 导出一个名为 GET 的泛型函数，用于发送 GET 请求
export function GET<T>(url: string, params?: any) {
  return instance.get<T>(url, { params })
}
// POST
// 导出一个名为 POST 的泛型函数，用于发送 POST 请求
export function POST<T>(url: string, data?: any) {
  return instance.post<T>(url, data)
}
// PUT
// 导出一个名为 PUT 的泛型函数，用于发送 PUT 请求
export function PUT<T>(url: string, data?: any) {
  return instance.put<T>(url, data)
}
//Delete
// 导出一个名为 Delete 的泛型函数，用于发送 HTTP DELETE 请求
export function Delete<T>(url: string) {
  return instance.delete<T>(url)
}
