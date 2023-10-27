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
      predictedTemperature: null
    }
  },
  computed: {
    // 根据年、月、日计算一年中的某一天
    dayOfYear () {
      if (this.selectedYear && this.selectedMonth && this.selectedDay) {
        const selectedDate = new Date(this.selectedYear, this.selectedMonth - 1, this.selectedDay)
        const startOfYear = new Date(selectedDate.getFullYear(), 0, 1)
        const day = Math.floor((selectedDate - startOfYear) / (24 * 60 * 60 * 1000)) + 1
        return day
      }
      return null
    }
  },
  methods: {
    async predictTemperature () {
      try {
        const response = await axios.post('http://122.51.210.27:5000/predict_temperature', {
          day_of_year: this.dayOfYear,
          year: this.selectedYear
        })
        this.predictedTemperature = response.data.predicted_temperature
      } catch (error) {
        console.error('错误：', error)
      }
    }
  }
}
</script>
