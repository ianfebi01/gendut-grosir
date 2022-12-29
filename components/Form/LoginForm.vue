<template>
  <v-container fluid class="px-0">
    <v-row :class="$vuetify.breakpoint.smAndDown ? 'mx-2' : 'mx-6'">
      <v-col cols="12" class="text-center">
        <div style="margin-bottom: 16px">
          <v-avatar size="auto" tile class="d-flex flex-column">
            <div>
              <v-img src="/logo.svg"></v-img>
            </div>
          </v-avatar>
        </div>
        <v-row>
          <v-col>
            <div
              class="font-weight-light text-neutral-70"
              style="font-size: 14px"
            >
              Sign In with Your account and enjoy shopping!
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row
      :class="$vuetify.breakpoint.smAndDown ? 'mx-2' : 'mx-6'"
      align="center"
      justify="center"
    >
      <v-col class="text-black">
        <v-divider class="mb-4"></v-divider>
        <v-btn
          href="http://localhost:8000/auth/facebook"
          :class="
            $vuetify.breakpoint.smAndDown
              ? 'white--text rounded-lg mb-4'
              : 'white--text rounded-lg'
          "
          color="#4267B2"
          large
          block
          depressed
          type="submit"
          :loading="loading"
          @click="loading = true"
        >
          <v-icon class="mr-2">mdi-facebook</v-icon>
          Sign In With Facebook
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
}
</script>
<style lang="scss" scoped>
:deep(.v-btn) {
  letter-spacing: 0;
}
:deep(
    .v-text-field--outlined:not(.v-input--is-focused)
      > .v-input__control
      > .v-input__slot
      fieldset
  ) {
  border: 2px solid #d0d5dd !important;
}
.round-corner {
  border-radius: 20px;
}
</style>
