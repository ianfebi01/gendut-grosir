<template>
  <v-dialog v-model="modal" persistent :width="width" scrollable>
    <v-card style="border-radius: 12px !important">
      <v-card-title
        class="d-flex flex-column justify-center letter-spacing-normal"
        style="width: 100%"
      >
        <Snackbar
          v-if="errorMessage"
          class="mb-2 mt-2"
          color="error"
          :text="errorMessage"
          @set="$emit('clearErrorMessage')"
        />
        <div class="icon mt-2 mb-4">
          <v-icon>{{ icon }}</v-icon>
        </div>
        <span
          class="text-18 font-weight-bold gray_900--text line-height-md mb-2"
          >{{ title }}</span
        >
        <span class="text-14 font-weight-normal gray_500--text line-height-md">
          {{ subtitle }}
        </span>
      </v-card-title>
      <v-card-text>
        <slot name="content"></slot>
      </v-card-text>
      <v-card-actions>
        <slot name="action">
          <v-col class="px-0 pr-1">
            <v-btn
              block
              outlined
              height="44"
              depressed
              :disabled="loading"
              dense
              @click="cancel"
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col class="px-0 pl-1">
            <v-btn
              block
              depressed
              height="44"
              color="primary"
              :loading="loading"
              :disabled="disable"
              @click="save"
            >
              Save
            </v-btn>
          </v-col>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Snackbar from '../Snackbar/Snackbar.vue'

export default {
  name: 'Modal',
  components: { Snackbar },
  props: {
    modalProp: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '$category_primary',
    },
    title: {
      type: String,
      default: 'Enter Title',
    },
    subtitle: {
      type: String,
      default: 'Enter Subtitle to make perfect design',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: 'You should set the text props!',
    },
    width: {
      type: String,
      default: '408px',
    },
  },
  computed: {
    modal: {
      get: function () {
        return this.modalProp
      },
      set: function (newValue) {
        this.$emit('modalProp', newValue)
      },
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel')
      this.modal = false
    },
    save() {
      this.$emit('save')
    },
  },
}
</script>
<style lang="scss" scoped>
@use '@/assets/scss/abstracts/variables.scss' as v;
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50% !important;
  background: v.$primary_100;
  width: 58px;
  height: 58px;
  border: 8px solid v.$primary_50;
}
</style>
