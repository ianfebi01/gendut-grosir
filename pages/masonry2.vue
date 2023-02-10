<template>
  <div id="container" class="container" style="border: 1px solid red">
    <div v-for="(item, i) in datas" :key="i" class="column">
      <div v-for="(gase, j) in item" :key="j" class="post">
        <img :src="gase.image" alt="" @click="scrollto" />
        <!-- <div class="random" :style="background"></div> -->
        <div class="overlay">
          <pre>{{ gase.title }}</pre>
        </div>
      </div>
    </div>
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
import { images, posts, posts2 } from '@/utils/items'
export default {
  name: 'Masonry',
  mixins: [directive],
  layout: 'dashboard',
  data() {
    return {
      gg: [],
    }
  },
  computed: {
    gambar() {
      return images
    },
    gambar2() {
      return images.reverse()
    },
    posts() {
      return posts
    },
    posts2() {
      return posts2
    },
    datas() {
      let col = this.$vuetify.breakpoint.xs
        ? 1
        : this.$vuetify.breakpoint.sm
        ? 2
        : this.$vuetify.breakpoint.md
        ? 3
        : this.$vuetify.breakpoint.lg
        ? 4
        : 5

      return this.divideArray(col, posts)
    },
    datas2() {
      let col = this.$vuetify.breakpoint.xs
        ? 1
        : this.$vuetify.breakpoint.sm
        ? 2
        : this.$vuetify.breakpoint.md
        ? 4
        : this.$vuetify.breakpoint.lg
        ? 5
        : 6
      return this.divideArray(col, posts2)
    },
    datas3() {
      let col = this.$vuetify.breakpoint.xs
        ? 1
        : this.$vuetify.breakpoint.sm
        ? 2
        : this.$vuetify.breakpoint.md
        ? 4
        : this.$vuetify.breakpoint.lg
        ? 5
        : 6
      return this.divideArray(posts2, col)
    },
  },
  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    scrollto() {
      document.getElementById('container').scrollTop = 400
    },
    handleScroll(e) {
      console.log(e)
    },
    divideArray(length, array) {
      const newArray = [...array]
      const divideRes = Math.floor(newArray.length / length)
      let results = []

      for (let i = 0; i < length; i++) {
        results.push(newArray.splice(0, divideRes))
      }

      for (let i = 0; i < newArray.length; i++) {
        results[i].push(newArray[i])
      }

      results = results.filter((itm) => itm.length)

      return results
    },
    generateMansory(columns, posts) {
      let columnWrapper = {}
      for (let i = 0; i < columns; i++) {
        columnWrapper[`column${i}`] = []
      }

      for (let i = 0; i < posts.length; i++) {
        const column = i % columns
        columnWrapper[`column${column}`].push(posts[i])
      }
      return columnWrapper
    },
  },
}
</script>
<style lang="scss" scoped>
@use '@/assets/scss/abstracts/variables.scss' as v;

.container {
  position: relative;
  width: 100%;
  display: flex;
  color: white;
  gap: 10px;
  padding: 100px 2vw;
  cursor: grab;
  overflow: auto;
}
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.post {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}
img {
  width: 100%;
  min-height: 100%;
  filter: grayscale(50%);
}
.random {
  content: '';
  width: 100%;
  height: 200px;
  background: v.$primary;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #161616;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.5s;
}
.post:hover .overlay {
  opacity: 0.95;
  cursor: pointer;
}
</style>
