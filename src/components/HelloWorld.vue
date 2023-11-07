<template>
    <dv-full-screen-container>
      <div style="display: flex; flex-direction: row; align-items: center;">
        <dv-decoration-8 style="height: 50px; flex: 1;" />
        <div style="display: flex; flex-direction: column;">
          <dv-decoration-7 style="flex: 1;font-size: 25px;color: white">智 能 照 明 管 理 系 统</dv-decoration-7>
          <dv-decoration-5 style="width: 300px; height: 40px;" />
        </div>
        <dv-decoration-8 :reverse="true" style="height: 50px; flex: 1;" />
      </div>
      <dv-border-box-8 style="flex: 0 1 60%;">
      <t-row :gutter="[12, 12]" >
      <t-col :xs="6" :xl="3"> <!-- xs 768p以下的长度 xl 1440p以上长度-->
        <dv-border-box-1>
        <t-card
          :bordered="false"
          style="height: 400px"
          class="transparent-card"
        >
          <div class="card-header">MQTT连接界面</div>
<!--                <t-input label="地址:" clearable v-model="host" placeholder="请输入" @clear="onClear" style="max-width: 500px"/>-->
<!--              <br>-->
<!--                <t-input label="端口:" clearable v-model="port" placeholder="请输入" @clear="onClear" style="max-width: 500px"/>-->
<!--              <br>-->
<!--                <t-input label="用户:" clearable v-model="clientId" placeholder="请输入" @clear="onClear" style="max-width: 500px"/>-->
             <br><br><br><br>
              <t-space align="center">
                <t-button
                  type="success"
                  size="medium"
                  icon=""
                  shape="round"
                  :disabled="loading || client.connected"
                  :plain="true"
                  @keyup.enter.native="mqttConnect"
                  @click="mqttConnect">
                  <span>连接</span>
                </t-button>
                <t-button
                  class="close-btn"
                  type="danger"
                  size="medium"
                  icon=""
                  :plain="true"
                  shape="round"
                  :loading="loading && client.connected"
                  :disabled="!loading && !client.connected"
                  @keyup.enter.native="disconnectSwitch"
                  @click="disconnectSwitch">
                  断开
                </t-button>
              </t-space>
              <br><br><br><br>
              <t-statistic> <span style="color:white;">连接状态:</span>
                <span :style="client.connected ? 'color: #42d885' : 'color: red'">{{ getStatus }}</span>
              </t-statistic>
<!--              <br>-->
<!--                <t-input label="主题:" clearable v-model="subTopic" placeholder="请输入" @clear="onClear" style="max-width: 500px"/>-->
<!--              <br>-->
              <t-button
                type="success"
                size="medium"
                :plain="true"
                shape="round"
                :disabled="!loading && !client.connected"
                @keyup.enter.native="handleSubscribeAndStartInterval"
                @click="handleSubscribeAndStartInterval">
                接受消息
              </t-button>
        </t-card>
        </dv-border-box-1>
        <br>
        <dv-border-box-1>
          <t-card
            :bordered="false"
            style="height: 440px"
            class="transparent-card"
          >
            <div class="card-header">数据展示</div>
            <t-row :gutter="[12, 12]" >
          <t-col :xs="12" :xl="12">
          <t-card
                 class="transparent-card"
                :bordered="false">
              <icon name="device" size="30px" class="icon-color"/><span class="light">设备数量：{{ deviceCount }}</span>
          </t-card>
            <br>
          </t-col>
            <t-col :xs="12" :xl="6">
            <t-card
              class="transparent-card"
              :bordered="false">
              <icon name="celsius" size="30px" class="icon-color"/><span class="light">温度:{{ getLatestValueByTopic('temp_hum/emqx', 'temp') }}°C</span>
            </t-card>
              <br>
              <br>
              <t-card
                class="transparent-card"
                :bordered="false">
                <icon name="sunny" size="30px" class="icon-color"/><span class="light">光强:{{ getLatestValueByTopic('temp_hum/emqx', 'light') }}Lx</span>
              </t-card>
            </t-col>
            <t-col :xs="12" :xl="6">
            <t-card
              class="transparent-card"
              :bordered="false">
            <icon name="rain-medium" size="30px" class="icon-color"/><span class="light">湿度:{{ getLatestValueByTopic('temp_hum/emqx', 'hum') }}%</span>
          </t-card>
              <br>
              <br>
            <t-card
              class="transparent-card"
              :bordered="false">
            <icon name="lightbulb" size="30px" class="icon-color"/><span class="light">功率:{{ getLatestValueByTopic('temp_hum/emqx', 'power') }}W</span>
            </t-card>
            </t-col>
            </t-row>
          </t-card>
        </dv-border-box-1>
      </t-col>

      <t-col :xs="12" :xl="6">
        <dv-border-box-1>
        <t-card
          :bordered="false"
          style="height: 400px"
          class="transparent-card"
        >
          <div class="card-header">数据统计</div>
            <temperature-humidity-chart :temperature-data="temperatureData" :humidity-data="humidityData" :lighting-data="lightingData"/>
        </t-card>
        </dv-border-box-1>
        <br>
        <dv-border-box-1>
        <t-card
          :bordered="false"
          style="height: 440px"
          class="transparent-card"
        >
          <div class="card-header">设备位置</div>
          <baidu-map class="bm-view" ak="fnppIqYtsg8hx6ap3KbZn6wuCRQnqFqd"
                     :center="parentCenter">
          </baidu-map>
        </t-card>
        </dv-border-box-1>
      </t-col>
      <t-col :xs="6" :xl="3">
        <dv-border-box-1>
        <t-card
          :bordered="false"
          style="height: 270px"
          class="transparent-card"
        >
          <Prediction/>
        </t-card>
        </dv-border-box-1>
        <br>
        <dv-border-box-1>
      <t-card
        :bordered="false"
        style="height: 270px"
        class="transparent-card"
      >
        <div class="card-header">灯光控制</div>
        <br>
        <br>
        <t-slider
          v-model="publishMessage"
          :input-number-props="inputNumberProps"
          @change="handleSliderInput"
        />
      </t-card>
        </dv-border-box-1>
        <br>
        <dv-border-box-1>
        <t-card
        :bordered="false"
        style="height: 278px"
        class="transparent-card"
        >
          <div class="card-header">设备报警</div>
          <div class="alert-container" style="height: 170px">
            <t-alert theme="error" v-for="(alert, index) in temperatureAlerts" :key="index"  class="alert" >
              {{ alert }}
            </t-alert>
            <t-alert theme="error" v-for="(alert, index) in humidityAlerts" :key="index"  class="alert" >
              {{ alert }}
            </t-alert>
          </div>
        </t-card>
        </dv-border-box-1>
      </t-col>
    </t-row>
      </dv-border-box-8>
    </dv-full-screen-container>
</template>
<script>
import mqtt from 'mqtt'
import MQTTConnect from '../../static/js/MQTTConnect'
import {Toast} from 'mint-ui'
import ECharts from 'vue-echarts'
import TemperatureHumidityChart from './TemperatureHumidityChart.vue'
import Navbar from './Navbar.vue'
import BaiduMap from './Map.vue'
import {Icon} from 'tdesign-icons-vue'
import Menu from './Menu.vue'
import moment from 'moment/moment'
import Prediction from './Prediction.vue'

export default {
  components: {
    TemperatureHumidityChart,
    Navbar,
    Icon,
    Menu,
    Prediction,
    BaiduMap,
    'chart': ECharts
  },
  mounted () {
    // 模拟获取温度值并定时检查
    this.mqttSubscribe() // 在组件创建后自动触发 mqttSubscribe 方法
    setInterval(this.checkTemperature, 2000) // 5秒钟检查一次
  },
  data () {
    return {
      deviceCount: 0,
      parentCenter: {
        lng: 116.404,
        lat: 39.915
      },
      retryTimes: 0,
      loading: false,
      sending: false,
      host: '122.51.210.27',
      port: 8083,
      username: '',
      sliderTimer: null,
      isSSL: false,
      password: '',
      keepalive: 60,
      clean: true,
      clientId: `mqttjs_${Math.random().toString(16).substr(2, 10)}`,
      subQos: 1,
      publishQos: 1,
      publishMessage: '0',
      subTopic: 'temp_hum/emqx',
      publishTopic: 'led/emqx',
      publishRetain: false,
      receivedMessages: [],
      publishedMessages: [],
      subscriptions: [],
      client: {},
      temperatureData: [], // 用于存储温度数据的数组
      humidityData: [],
      lightingData: [],
      powerData: [],
      idData: [],
      lngData: [],
      latData: [],
      localCoordinates: [],
      temperatureAlerts: [],
      humidityAlerts: [],
      inputNumberProps: {
        size: 'large'
      },
      deviceLocation: []
    }
  },
  computed: {
    getStatus () {
      if (this.client.connected) {
        return '已连接'
      }
      if (this.loading) {
        return '连接中'
      }
      return '未连接'
    },
    supportWebSocket () {
      return window.WebSocket
    }
  },
  methods: {
    onClear () {
      console.log('clear')
    },
    handleSliderInput () {
      // 当滑条输入事件触发时
      if (this.sliderTimer !== null) {
        clearTimeout(this.sliderTimer) // 清除之前的定时器
      }
      // 获取滑条的值
      const newLedValue = this.publishMessage

      // 只有在滑条的值发生变化时才发送MQTT消息
      if (newLedValue !== this.getLatestValueByTopic('temp_hum/emqx', 'LED')) {
        this.sliderTimer = setTimeout(() => {
          this.mqttPublish(newLedValue)
        }, 70)
      }
    },
    checkTemperature () {
      // 获取温度和湿度值
      const temperature = this.getLatestValueByTopic('temp_hum/emqx', 'temp')
      const humidity = this.getLatestValueByTopic('temp_hum/emqx', 'hum')

      // 检查温度是否在范围内
      if (temperature !== 'N/A') {
        const numericTemperature = parseFloat(temperature)

        // 检查湿度是否在范围内
        if (humidity !== 'N/A') {
          const numericHumidity = parseFloat(humidity)
          const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')

          if ((numericTemperature < -40 || numericTemperature > 85) && (numericHumidity < 0 || numericHumidity > 95)) {
            // 两者都超出范围
            const alertMessage = `${currentTime} 温度,湿度超出范围, 温度:${numericTemperature}°C, 湿度:${numericHumidity}%`
            this.temperatureAlerts.push(alertMessage)
            // 在这里执行触发综合警告的操作，例如向服务器发送综合警报等
          } else if (numericTemperature < -40 || numericTemperature > 85) {
            // 只温度超出范围
            const alertMessage = `${currentTime} 温度超出范围, 温度:${numericTemperature}°C`
            this.temperatureAlerts.push(alertMessage)
            // 在这里执行触发温度警告的操作
          } else if (numericHumidity < 0 || numericHumidity > 95) {
            // 只湿度超出范围
            const alertMessage = `${currentTime} 湿度超出范围, 湿度:${numericHumidity}%`
            this.humidityAlerts.push(alertMessage)
            // 在这里执行触发湿度警告的操作
          }
        }
      }
    },
    updateChartData () {
      const temperature = this.getLatestValueByTopic('temp_hum/emqx', 'temp')
      const humidity = this.getLatestValueByTopic('temp_hum/emqx', 'hum')
      const light = this.getLatestValueByTopic('temp_hum/emqx', 'light')
      const power = this.getLatestValueByTopic('temp_hum/emqx', 'power')
      const id = this.getLatestValueByTopic('temp_hum/emqx', 'id')
      const led = this.getLatestValueByTopic('temp_hum/emqx', 'LED')
      const lng = this.getLatestValueByTopic('temp_hum/emqx', 'lng')
      const lat = this.getLatestValueByTopic('temp_hum/emqx', 'lat')

      // 判断是否要添加数据
      if (temperature !== 'N/A' && humidity !== 'N/A' && light !== 'N/A' && power !== 'N/A') {
        const currentTime = new Date()

        // 判断是否是新数据，避免重复添加相同时间的数据
        if (!this.temperatureData.length || this.temperatureData[this.temperatureData.length - 1].time.getTime() !== currentTime.getTime()) {
          this.temperatureData.push({ time: currentTime, value: temperature })
          this.humidityData.push({ time: currentTime, value: humidity })
          this.lightingData.push({ time: currentTime, value: light })
          this.powerData.push({ time: currentTime, value: power })
          this.idData.push({ time: currentTime, value: id })
          this.lngData.push({ time: currentTime, value: lng })
          this.latData.push({ time: currentTime, value: lat })
          this.calculateDeviceCount()
          if (led !== 'N/A' && led !== this.publishMessage) {
            this.publishMessage = led
          }
        }
      }
    },
    getLatestValueByTopic (topic, key) {
      const messagesForTopic = this.receivedMessages.filter(message => message.topic === topic)
      if (messagesForTopic.length > 0) {
        const messageContent = JSON.parse(messagesForTopic[0].message)
        return messageContent[key] !== undefined ? messageContent[key] : 'N/A'
      } else {
        return '无消息' // 如果没有匹配到消息，返回 "N/A"
      }
    },
    calculateDeviceCount () {
      const uniqueIds = [...new Set(this.idData.map(item => item.value))]
      this.deviceCount = uniqueIds.length
    },
    now () {
      // return dateformat(new Date(), 'yyyy-mm-dd hh:MM:ss')
    },
    handleSSL () {
      this.port = this.isSSL ? 8084 : 8083
    },
    disconnectSwitch () {
      // connecting
      if (this.loading && !this.client.connected) {
        this.loading = false
        this.client.end()
        this.client = {}
        this.$router.push(this.$route.path)
      } else {
        this.mqttDisconnect()
      }
    },
    mqttConnect () {
      if (!this.supportWebSocket) {
        Toast({
          message: 'notSupport',
          duration: 2000
        })
        return
      }
      // prevent the connect from keyboard event
      if (this.client.connected || this.loading) {
        return
      }
      this.loading = true
      this.retryTimes = 0
      const options = {
        keepalive: this.keepalive,
        username: this.username,
        password: this.password,
        clientId: this.clientId,
        clean: this.clean,
        connectTimeout: 4000
      }
      const protocol = this.isSSL ? 'wss' : 'ws'
      this.client = mqtt.connect(`${protocol}://${this.host}:${this.port}/mqtt`, options)
      this.client.on('connect', () => {
        this.loading = false
      })
      this.client.on('reconnect', () => {
        if (this.retryTimes > 1) {
          if (this.sending) {
            Toast({
              message: 'connectError',
              duration: 2000
            })
          } else {
            Toast({
              message: 'connectFailure',
              duration: 2000
            })
          }
          this.retryTimes = 0
          this.sending = false
          this.loading = false
          this.client.end()
          this.client = {}
        }
        // trigger by sending illegal topic
        if (this.sending) {
          Toast({
            message: 'connectError',
            duration: 2000
          })
        }
        this.retryTimes += 1
      })
      this.client.on('error', (error) => {
        Toast({
          message: error,
          duration: 2000
        })
        // to prevent reconnect
        this.retryTimes = 0
      })
      this.client.on('message', (topic, message, packet) => {
        this.receivedMessages.unshift({
          topic,
          message: message.toString(),
          qos: packet.qos,
          time: this.now()
        })
      })
    },
    mqttDisconnect () {
      if (this.client.connected) {
        this.client.end()
        this.client.on('close', () => {
          this.loading = false
          this.reset()
          this.client = {}
        })
      } else {
        Toast({
          message: 'connectLeave',
          duration: 2000
        })
      }
    },
    mqttSubscribe () {
      // 检查 MQTT 客户端是否已连接
      if (this.client.connected) {
        // 遍历已订阅的主题列表
        this.subscriptions.forEach((x, index) => {
          // 如果某个已订阅主题与当前订阅主题相同
          if (x.topic === this.subTopic) {
            // 从订阅列表中移除该订阅
            this.subscriptions.splice(index, index + 1)
          }
        })
        // 使用 MQTT 客户端订阅指定的主题
        this.client.subscribe(this.subTopic, {qos: this.subQos}, (error) => {
          if (error) {
            // 如果订阅过程中出现错误，显示错误提示
            Toast({
              message: 'error',
              duration: 2000
            })
          } else {
            // 如果订阅成功，将该订阅添加到订阅列表的开头
            this.subscriptions.unshift({
              topic: this.subTopic,
              qos: this.subQos,
              time: this.now()
            })
            Toast({
              message: '连接成功',
              duration: 2000
            })
          }
        })
      } else {
        // 如果 MQTT 客户端未连接，显示连接提示
        Toast({
          message: '连接丢失',
          duration: 2000
        })
      }
    },
    mqttPublish (ledValue) {
      if (this.client.connected) {
        const numericValue = parseInt(ledValue) // 将输入的内容解析为整数
        // const temperature = this.getLatestValueByTopic('temp_hum/emqx', 'temp')
        // const humidity = this.getLatestValueByTopic('temp_hum/emqx', 'hum')
        // const light = this.getLatestValueByTopic('temp_hum/emqx', 'light')
        // const power = this.getLatestValueByTopic('temp_hum/emqx', 'power')
        // const id = this.getLatestValueByTopic('temp_hum/emqx', 'id')
        // const lng = this.getLatestValueByTopic('temp_hum/emqx', 'lng')
        // const lat = this.getLatestValueByTopic('temp_hum/emqx', 'lat')
        if (!isNaN(numericValue)) { // 检查是否为有效数字
          const messageObject = {'led': numericValue} // 创建消息对象

          const messageString = JSON.stringify(messageObject) // 将消息对象转换为字符串
          const options = {
            qos: this.publishQos,
            retain: this.publishRetain
          }
          // to mark which trigger the reconnect
          this.sending = true
          this.client.publish(this.publishTopic, messageString, options, (error) => {
            if (error) {
              Toast({
                message: 'error',
                duration: 2000
              })
            } else {
              this.publishedMessages.unshift({
                message: this.publishMessage,
                topic: this.publishTopic,
                qos: this.publishQos,
                time: this.now()
              })
              // Toast({
              //   message: '指令已发送',
              //   duration: 2000
              // })
            }
          })
        // } else {
        //   // 处理无效输入，您可以显示错误消息或采取其他操作
        //   Toast({
        //     message: 'Invalid input',
        //     duration: 2000
        //   })
        }
      }
    },
    mqttCacheScuscribe (topic) {
      if (!this.client.connected) {
        Toast({
          message: 'connectLeave',
          duration: 2000
        })
        return
      }
      this.client.unsubscribe(topic, (error) => {
        if (error) {
          Toast({
            message: 'unsubscribeFailure',
            duration: 2000
          })
          return
        }
        this.subscriptions.forEach((element, index) => {
          if (element.topic === topic) {
            this.subscriptions.splice(index, 1)
            // clear message which in this topic
          }
        })
      })
    },
    reset () {
      this.subscriptions = []
      this.receivedMessages = []
      this.publishedMessages = []
      this.publishMessage = 'Hello world!'
      this.subTopic = 'temp_hum/emqx'
      this.publishTopic = '/World'
    },
    clearMessage (received = true) {
      if (received) {
        this.receivedMessages = []
      } else {
        this.publishedMessages = []
      }
    },
    loadConnect () {
      if (MQTTConnect.client && MQTTConnect.client.connected) {
        this.client = MQTTConnect.client
        Object.keys(MQTTConnect.options).forEach((item) => {
          this[item] = MQTTConnect.options[item]
        })
      }
    },
    stashConnect () {
      MQTTConnect.client = this.client
      Object.keys(MQTTConnect.options).forEach((item) => {
        MQTTConnect.options[item] = this[item]
      })
    },
    handleSubscribeAndStartInterval () {
      // 在按钮点击时同时执行mqttSubscribe和启动setInterval
      this.mqttSubscribe()
      // 启动定时任务，注意存储定时任务的ID以便后续取消
      this.intervalId = setInterval(() => {
        this.updateChartData()
      }, 1000)
    }
  },
  beforeDestroy () {
    // 在组件销毁前取消定时任务，以防内存泄漏
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  },
  watch: {
    // 监听lngData和latData属性的变化
    lngData (newLngData) {
      // 获取最新的经度值，假设是最后一个数据项的value
      // 更新parentCenter的lng属性
      this.parentCenter.lng = newLngData[newLngData.length - 1].value
    },
    latData (newLatData) {
      // 获取最新的纬度值，假设是最后一个数据项的value
      // 更新parentCenter的lat属性
      this.parentCenter.lat = newLatData[newLatData.length - 1].value
    }
  },
  created () {
    let prevLng = null // 用于存储前一个经度值
    let prevLat = null// 用于存储前一个纬度值

    setInterval(() => {
      const newLng = 40.0 // 新的经度
      const newLat = 39.0 // 新的纬度

      // 仅当位置发生变化时才进行更新
      if (newLng !== prevLng || newLat !== prevLat) {
        // 模拟数据记录
        this.lngData.push({ time: new Date(), value: newLng })
        this.latData.push({ time: new Date(), value: newLat })

        // 更新前一个位置的值
        prevLng = newLng
        prevLat = newLat

        // 更新parentCenter的lng和lat属性
        this.parentCenter.lng = newLng
        this.parentCenter.lat = newLat
      }
    }, 5000)
  },
  beforeRouteLeave (to, from, next) {
    if (this.client.connected) {
      this.stashConnect()
    }
    next()
  }
}
</script>

<style lang="less" scoped>
.websocket-view {
  .el-select {
    width: 100%;
  }

  .refresh-btn {
    font-size: 12px;
    margin-left: 8px;
    cursor: pointer;
  }

  .connect-state {
    display: inline-block;
  }

  .el-table {
    margin-top: 5px;
    /* 增加内边距 */
    border-width: 0 !important;
  }

  .el-card {
    margin-top: 24px;
  }

  .el-input,
  .el-checkbox {
    margin: 5px 0 20px;
  }

  .el-button {
    display: inline-block;
    width: 100px;

    &.unsubscribe {
      width: auto;
    }
  }

  &--main-color {
    background: var(--td-brand-color);
    color: var(--td-text-color-primary);

    /deep/ .t-card__title,
    .dashboard-item-top span,
    .dashboard-item-bottom {
      color: var(--td-text-color-anti);
    }

    .dashboard-item-block {
      color: var(--td-text-color-anti);
      opacity: 0.6;
    }

    .dashboard-item-bottom {
      color: var(--td-text-color-anti);
    }
  }
}

.temperature-humidity {
  font-size: 20px; /* Adjust the font size as needed */
}

.temperature,
.humidity ,
.light{
  font-size: 20px; /* Adjust the font size as needed */
  color: white;
}
.top-nav {
  background-color:white;
  color: #fff;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 可选，根据需要设置z-index值 */
}

.top-nav ul {
  list-style: none;
  font-size: 20px;
  margin: 0;
  padding: 0;
  text-align: left;
}

.top-nav li {
  display: inline-block;
  margin-right: 20px;
}

.top-nav a {
  text-decoration: none;
  color: black;
  font-weight: bold;
}

.top-nav a:hover {
  text-decoration: underline;
}

/* 添加样式以避免内容被导航栏遮挡 */
.content {
  margin-top: 40px; /* 根据导航栏高度调整 */
}
.alert-container {
  max-height: 200px; /* 控制警报容器的最大高度，超过这个高度会出现滚动条 */
  overflow-y: auto; /* 添加垂直滚动条 */
}

.alert {
  padding: 10px;
  border: 1px solid #ccc;
  margin: 5px;
  color:red;
}
html, body, ul, li {
  margin: 0;
  padding: 0;
}
.alert-message {
  color: red;
}
 .bm-view {
   width: 100%;
   height: 350px;
 }
.transparent-card {
  //border: 3px solid black;
  background-color: transparent;
}
.component-container {
  /* 替换为实际的图像路径 */
  background-size: cover; /* 设置背景图像铺满整个容器 */
  background-repeat: no-repeat; /* 防止图像重复 */
  /* 添加其他样式，例如背景颜色、内边距等 */
}
#dv-full-screen-container {
  background-image: url('./bg.png');
  background-size: 100% 100%;
  box-shadow: 0 0 3px blue;
  display: flex;
  flex-direction: column;
}
.card-header{
  color: white;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
}
.icon-color{
  color: white;
}
</style>
