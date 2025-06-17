import { POST } from '../utils/http.ts'

// 测试需要加/api/
const baseUrl = '/cashin'

// 提交支付信息
export const submit = (data: any) => POST(baseUrl + '/payment/submit', data)

// 获取订单状态
export const getstatus = (sn: string) => POST(baseUrl + '/payment/status', { sn })

// 获取订单信息
export const getinfo = (sn: string) => POST(baseUrl + 'cashin/payment/info', { sn })

// 获取信息
export const getOrderInfo = (sn: string, bankCode: string) => POST(baseUrl + '/payment/info', { sn, bankCode })

// 补单接口
export const reOrder = (data: any) => POST(baseUrl + '/payment/resubmit', data)
