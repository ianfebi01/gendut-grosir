<template>
  <v-app>
    <div class="container">
      <div v-for="(item, i) in datas" :key="i" class="column">
        <div v-for="(gase, j) in item" :key="j" class="post">
          <img :src="gase.image" alt="" />
          <!-- <div class="random" :style="background"></div> -->
          <div class="overlay">
            <pre>{{ gase.title }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- color -->
    <div class="container">
      <div v-for="(item, i) in datas2" :key="i" class="column">
        <div v-for="(gase, j) in item" :key="j" class="post">
          <!-- <img :src="gase.image" alt="" /> -->
          <div
            class="random"
            :style="`background: ${gase.color}; height: ${gase.height}`"
          ></div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import { images, posts, posts2 } from '@/utils/items'
export default {
  name: 'Masonry',
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
      console.log('col', col)
      return this.generateMansory(col, posts)
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
      console.log('col', col)
      return this.generateMansory(col, posts2)
    },
  },
  mounted() {},
  methods: {
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
  border: 1px solid red;
}
</style>
