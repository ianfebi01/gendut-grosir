<template>
  <v-dialog v-model="modal" persistent width="408">
    <v-card style="border-radius: 12px !important">
      <v-card-title
        class="d-flex flex-column justify-center letter-spacing-normal"
        style="width: 100%"
      >
        <div class="icon mt-2 mb-4">
          <v-icon>{{ icon }}</v-icon>
        </div>
        <span
          class="text-18 font-weight-bold gray_900--text line-height-md mb-2"
          >{{ title }}</span
        >
        <span
          class="text-14 font-weight-normal gray_500--text text-center line-height-md"
        >
          {{ subtitle }}
        </span>
      </v-card-title>
      <v-card-text class="py-0">
        <slot name="content"></slot>
      </v-card-text>
      <v-card-actions>
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
            color="error_600"
            class="white--text"
            :loading="loading"
            @click="ok"
          >
            Delete
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteModal',
  props: {
    icon: {
      type: String,
      default: '$category_primary',
    },
    title: {
      type: String,
      default: 'Delete',
    },
    subtitle: {
      type: String,
      default:
        'Are you sure you want to delete this? This action cannot be undone.',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: 'You should set the text props!',
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
    ok() {
      this.$emit('ok')
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
  background: v.$error_100;
  width: 58px;
  height: 58px;
  border: 8px solid v.$error_50;
}
</style>
