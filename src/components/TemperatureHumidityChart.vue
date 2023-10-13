<template>
  <div class="t-align-center" style="width:100%;height:700px">
    <chart :option="chartOptions" style="height: 300px;"></chart>
  </div>

</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts'

export default {
  components: {
    'chart': ECharts
  },
  props: ['temperatureData', 'humidityData', 'lightingData'],
  data () {
    return {
      currentIndex: 0 // x 轴滚动的初始索引
    }
  },
  computed: {
    chartOptions () {
      const visibleData = this.temperatureData.slice(this.currentIndex)
      return {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['温度', '湿度', '光强']
        },
        xAxis: {
          type: 'category',
          data: visibleData.map(entry => entry.time), // 使用时间作为横轴数据
          axisLabel: {
            formatter: function (value, index) {
              const date = new Date(value)
              const cstTime = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000)
              const year = cstTime.getFullYear()
              const month = cstTime.getMonth() + 1
              const day = cstTime.getDate()
              const hours = cstTime.getHours()
              const minutes = cstTime.getMinutes()
              const seconds = cstTime.getSeconds()
              const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
              const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
              return `${year}-${month}-${day} \n${hours}:${formattedMinutes}:${formattedSeconds}`
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '温度',
            position: 'left',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: 'red'
              }
            },
            axisLabel: {
              formatter: '{value}°C'
            }
          },
          {
            type: 'value',
            name: '光强',
            position: 'right',
            alignTicks: true,
            offset: 40,
            axisLine: {
              show: true,
              lineStyle: {
                color: 'green'
              }
            },
            axisLabel: {
              formatter: '{value}Lx'
            }
          },
          {
            type: 'value',
            name: '湿度',
            position: 'right',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: 'blue'
              }
            },
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '温度',
            type: 'bar',
            data: this.temperatureData.map(entry => entry.value), // 温度数据
            yAxisIndex: 0,
            itemStyle: {
              color: '#BF4C55' // 设置温度系列的颜色为红色
            }
          },
          {
            name: '湿度',
            type: 'line',
            data: this.humidityData.map(entry => entry.value), // 湿度数据
            yAxisIndex: 2,
            itemStyle: {
              color: '#00BCD0' // 设置湿度系列的颜色为蓝色
            }
          },
          {
            name: '光强',
            type: 'line',
            data: this.lightingData.map(entry => entry.value), // 光强数据
            yAxisIndex: 1,
            itemStyle: {
              color: '#574141' // 设置光强系列的颜色为绿色
            }
          }
        ]
      }
    }
  },
  mounted () {
    // 使用 setInterval 定期更新 currentIndex 并触发图表更新
    setInterval(() => {
      if (this.currentIndex < this.temperatureData.length - 1) {
        this.currentIndex++ // 增加 currentIndex 以向左滚动
      } else {
        this.currentIndex = 0// 当达到最后一个数据时，重新开始滚动
      }
    }, 2000) // 设置滚动的间隔时间（以毫秒为单位）
  }
}
</script>
