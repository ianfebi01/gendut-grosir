<template>
  <v-card
    class="d-flex align-center justify-space-between py-3 px-4"
    style="border-radius: 8px; box-shadow: 0px 2px #eaecf0"
    :color="color"
    width="100%"
  >
    <div class="d-flex align-center font-weight-medium" style="color: #1bbf70">
      <span class="white--text text-14">{{ text }}</span>
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
    color: { type: String, default: 'success' },
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

<style></style>
