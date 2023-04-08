<template>
  <v-card
    :class="`d-flex align-center justify-space-between py-3 px-4 ${position} ${
      visibility ? 'visible' : 'hidden'
    }`"
    style="border-radius: 8px"
    :color="color"
    :width="width"
  >
    <div class="d-flex align-center font-weight-medium" style="color: #1bbf70">
      <span class="white--text text-14 line-height-normal word-break-word">{{
        text
      }}</span>
    </div>
    <v-btn fab small icon color="white" text @click="$emit('set')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
export default {
  name: 'Snackbar',
  props: {
    text: { type: String, default: 'You should set the text props!' },
    color: { type: String, default: 'success_600' },
    width: {
      type: String,
      default: '100%',
    },
    position: {
      type: String,
      default: '',
    },
    visibility: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    /**
     * set a countdown to get rid of the snackbar.
     */
    setTimeout(() => {
      /**
       * Close the Snackbar.
       */

      this.$emit('set')
    }, 3000)
  },
}
</script>

<style lang="scss" scoped>
.fixed {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 10;
}
/*  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.5s; */

.visible {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.5s ease-in;
}

.hidden {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.5s, opacity 0.5s ease-out;
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
