/*vxe-table表格格式化*/
import XEUtils from 'xe-utils'

export default function () {
  return {
    // 格式化日期，默认 yyyy-MM-dd HH:mm:ss
    formatDate({cellValue}, format, defaultValue) {
      if (!cellValue) {
        return defaultValue || '暂无数据'
      }
      return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd HH:mm:ss')
    },
    // 默认整数
    formatNumber({cellValue}) {
      if (cellValue)
        return XEUtils.toFixed(XEUtils.round(cellValue, digits), digits)
      else
        return 0
    },
    // 四舍五入金额，每隔3位逗号分隔，默认2位数
    formatAmount({cellValue}, digits = 2) {
      return XEUtils.commafy(XEUtils.toNumber(cellValue), {digits})
    },
    // 四舍五入,默认两位数
    formatFixedNumber({cellValue}, digits = 2) {
      return XEUtils.toFixed(XEUtils.round(cellValue, digits), digits)
    },
    // 向下舍入,默认两位数
    formatCutNumber({cellValue}, digits = 2) {
      return XEUtils.toFixed(XEUtils.floor(cellValue, digits), digits)
    }
  }
}
