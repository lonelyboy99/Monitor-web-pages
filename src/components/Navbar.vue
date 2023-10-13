<template>
  <div>
    <t-head-menu theme="light" v-model="menu1Value" @change="changeHandler">
      <template #logo>
        <img height="55" src="./logo.png" alt="logo" />
      </template>
      <t-menu-item value="item1" href="/">首页</t-menu-item>
      <template #operations>
        <!-- 添加一个时间显示 -->
        <div class="time-display">{{ currentTime }}</div>
<!--        <t-button variant="text" shape="square">-->
<!--          <search-icon slot="icon" shape="square" />-->
<!--        </t-button>-->
<!--        <t-button variant="text" shape="square">-->
<!--          <mail-icon slot="icon" />-->
<!--        </t-button>-->
<!--        <t-button variant="text" shape="square">-->
<!--          <user-icon slot="icon" />-->
<!--        </t-button>-->
<!--        <t-button variant="text" shape="square">-->
<!--          <ellipsis-icon slot="icon" />-->
<!--        </t-button>-->
      </template>
    </t-head-menu>
  </div>
</template>

<script>
import {
  SearchIcon, MailIcon, UserIcon, EllipsisIcon
} from 'tdesign-icons-vue'
import moment from 'moment'

export default {
  components: {
    SearchIcon,
    MailIcon,
    UserIcon,
    EllipsisIcon
  },
  data () {
    return {
      menu1Value: 'item2',
      menu2Value: 'item1',
      currentTime: ''
    }
  },
  methods: {
    changeHandler (active) {
      console.log('change', active)
    }
  },
  created () {
    // 启动一个定时器，每秒更新一次时间
    setInterval(() => {
      this.currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
.t-menu__operations {
  .t-button {
    margin-left: 8px;
  }
}
.t-demo-menu--dark {
  .t-button {
    color: #fff;

    &:hover {
      background-color: #4b4b4b;
      border-color: transparent;
      --ripple-color: #383838;
    }
  }
}
.time-display {
  color: white;
  margin-right: 10px;
  font-weight: bold;
}
</style>
