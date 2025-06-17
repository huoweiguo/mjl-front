import { POST } from '../utils/http.ts'
import type { IUser } from '../../types/interface.d.ts'
// 测试
export const test = (data: IUser) => POST('/test', data)
