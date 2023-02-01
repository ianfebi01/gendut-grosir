<template>
  <div
    id="container"
    class="container-box"
    style="border: 1px solid red"
    @mousedown="mouseDownHandler"
    @wheel="scroll"
  >
    <!-- <div v-for="item in 20" :key="item" class="list"></div> -->
    <v-img
      :width="`${width}%`"
      src="https://dr.savee-cdn.com/things/6/3/c97ab2177ff052888805c9.png"
    >
    </v-img>
  </div>

  <!-- color -->
  <!-- <div class="container">
    <div v-for="(item, i) in datas2" :key="i" class="column">
      <div v-for="(gase, j) in item" :key="j" class="post">
        <div
          class="random"
          :style="`background: ${gase.color}; height: ${gase.height}`"
        ></div>
      </div>
    </div>
  </div> -->
</template>

<script>
import directive from '@/utils/directive'

export default {
  name: 'Masonry',
  mixins: [directive],
  layout: 'dashboard',
  data() {
    return {
      gg: [],
      pos: { top: 0, left: 0, x: 0, y: 0 },
      width: 100,
    }
  },
  computed: {},

  mounted() {
    // const ele = document.getElementById('container')
    // ele.scrollTop = 1000
  },
  methods: {
    scrollto() {
      document.getElementById('container').scrollTop = 400
    },

    mouseDownHandler(e) {
      const ele = document.getElementById('container')
      ele.style.cursor = 'grabbing'
      ele.style.userSelect = 'none'
      this.pos = {
        // The current scroll
        left: ele.scrollLeft,
        top: ele.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
      }

      document.addEventListener('mousemove', this.mouseMoveHandler)
      document.addEventListener('mouseup', this.mouseUpHandler)
    },
    mouseMoveHandler(e) {
      const ele = document.getElementById('container')
      // How far the mouse has been moved
      const dx = e.clientX - this.pos.x
      const dy = e.clientY - this.pos.y

      // Scroll the element
      ele.scrollTop = this.pos.top - dy
      ele.scrollLeft = this.pos.left - dx
    },
    mouseUpHandler() {
      const ele = document.getElementById('container')
      document.removeEventListener('mousemove', this.mouseMoveHandler)
      document.removeEventListener('mouseup', this.mouseUpHandler)

      ele.style.cursor = 'grab'
      ele.style.removeProperty('user-select')
    },
    scroll(e) {
      const ele = document.getElementById('container')
      ele.style.overflow = 'hidden'
      this.zoom(e)
    },
    zoom(e) {
      {
        if (e.deltaY > 0) {
          this.width = this.width += 5
        } else {
          if (this.width > 100) {
            this.width = this.width -= 5
          }
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@use '@/assets/scss/abstracts/variables.scss' as v;

.container-box {
  width: 400px;
  height: 400px;
  color: white;
  padding: 20px 20px;
  cursor: grab;
  overflow: auto;
}
:deep(.v-responsive) {
  max-width: unset;
}

.list {
  content: '';
  width: 100%;
  height: 50px;
  background: v.$primary;
  border: 1px solid blue;
  margin-bottom: 10px;
}
</style>
