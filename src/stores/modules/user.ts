import { defineStore } from 'pinia'

const useUserInfo = defineStore('userInfo', {
  state: () => ({
    // 用户信息
    userInfo: { name: '张三' }
  }),
  actions: {
    // 修改用户详情
    UpdataUserInfo(data: any) {
      this.userInfo = data
    }
  },
  getters: {},
  // persist: true, 默认将整个UserInfo持久化存储
  persist: {
    key: 'userInfo', //存储名称
    storage: localStorage // 存储方式
  }
})

export default useUserInfo
