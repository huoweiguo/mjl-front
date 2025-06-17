export const getRemainingTime = (expireTimestamp: number) => {
  const now = Date.now() // 获取当前时间戳‌:ml-citation{ref="1,4" data="citationList"}
  const diff = expireTimestamp - now // 计算剩余毫秒数‌:ml-citation{ref="2,7" data="citationList"}

  // 处理已过期情况
  if (diff <= 0) return { diff, days: 0, hours: '00', minutes: '00', seconds: '00' }

  // 时间单位转换计算‌:ml-citation{ref="3,6" data="citationList"}
  const seconds = Math.floor(diff / 1000)
  const days = Math.floor(seconds / 86400) // 1天=86400秒
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return {
    diff,
    days,
    hours: hours.toString().padStart(2, '0'), // 补零显示‌:ml-citation{ref="3" data="citationList"}
    minutes: minutes.toString().padStart(2, '0'),
    seconds: remainingSeconds.toString().padStart(2, '0')
  }
}
