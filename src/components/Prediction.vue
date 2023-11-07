<template>
  <div>
    <h1 style="color:white;">温度预测</h1>
    <div>
      <div>
        <label for="year" style="color:white;">年：</label>
        <input type="number" id="year" v-model="selectedYear" />
      </div>
      <div>
        <label for="month" style="color:white;">月：</label>
        <input type="number" id="month" v-model="selectedMonth" />
      </div>
      <div>
        <label for="day" style="color:white;">日：</label>
        <input type="number" id="day" v-model="selectedDay" />
      </div>
      <div>
        <label for="hour" style="color:white;">小时：</label>
        <input type="number" id="hour" v-model="selectedHour" />
      </div>
      <div>
        <label for="minute" style="color:white;">分钟：</label>
        <input type="number" id="minute" v-model="selectedMinute" />
      </div>
    </div>
    <button @click="predictTemperature">预测温度</button>
    <p v-if="predictedTemperature !== null" style="color: white">
      预测温度：{{ predictedTemperature.toFixed(2) }}°C
    </p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      selectedYear: null,
      selectedMonth: null,
      selectedDay: null,
      selectedHour: null,
      selectedMinute: null,
      predictedTemperature: null
    }
  },
  methods: {
    async predictTemperature () {
      try {
        const response = await axios.post('http://127.0.0.1:5000/predict_temperature', {
          year: this.selectedYear,
          month: this.selectedMonth,
          day: this.selectedDay,
          hour: this.selectedHour,
          minute: this.selectedMinute
        })
        this.predictedTemperature = response.data.predicted_temperature
      } catch (error) {
        console.error('错误：', error)
      }
    }
  }
}
</script>
