<template>
  <v-dialog v-model="modal" persistent :width="width" scrollable>
    <v-card style="border-radius: 12px !important">
      <v-card-title
        class="d-flex flex-column justify-center letter-spacing-normal mb-2"
        style="width: 100%"
      >
        <transition name="fade">
          <Snackbar
            v-if="errorMessage"
            color="error"
            position="fixed"
            width="330px"
            :visibility="true"
            :text="errorMessage"
            @set="$emit('clearErrorMessage')"
          />
        </transition>
        <div :class="`${type === 'default' ? 'icon' : type} mt-2 mb-4`">
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
              {{ cancelText }}
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
              {{ saveText }}
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
    type: {
      type: String,
      default: 'default',
    },
    disable: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '408px',
    },
    value: {
      type: Boolean,
      default: false,
    },
    minHeight: {
      type: String,
      default: '',
    },
    saveText: {
      type: String,
      default: 'Simpan',
    },
    cancelText: {
      type: String,
      default: 'Batal',
    },
  },
  computed: {
    modal: {
      get: function () {
        return this.value
      },
      set: function (newValue) {
        this.$emit('input', newValue)
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
.oke {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50% !important;
  background: v.$success_100;
  width: 58px;
  height: 58px;
  border: 8px solid v.$success_50;
}

// Component <transition>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
