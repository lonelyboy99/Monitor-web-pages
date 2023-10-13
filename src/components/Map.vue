<template>
  <baidu-map
    class="map"
    :scroll-wheel-zoom="true"
    :center="center"
    :zoom="20"
    @moving="syncCenterAndZoom"
    @moveend="syncCenterAndZoom">
    <bm-marker :position="center" :dragging="true">
    </bm-marker>
  </baidu-map>
</template>

<script>

export default {
  props: {
    center: Object // 从父组件传递的中心坐标对象
  },
  methods: {
    syncCenterAndZoom (e) {
      const {lng, lat} = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
    }
  }
}
</script>
