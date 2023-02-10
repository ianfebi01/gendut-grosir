<template>
  <v-menu v-model="menu" offset-y :close-on-content-click="false">
    <template #activator="{ on, attrs }">
      <v-text-field
        :value="`${$moment(range.start).format('D MMM YYYY')} - ${$moment(
          range.end
        ).format('D MMM YYYY')}`"
        background-color="#fff"
        hide-details
        outlined
        height="44px"
        dense
        flat
        readonly
        style="width: 250px !important"
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-card rounded="lg">
      <VcDatepicker
        v-model="range"
        is-range
        :columns="2"
        color="primary"
        :max-date="maxDate"
      />

      <v-divider></v-divider>
      <v-card-actions class="d-flex pa-4">
        <v-btn
          color="gray_900"
          depressed
          outlined
          class="px-4"
          height="44"
          @click="handleClickReset"
        >
          Reset
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="gray_900"
          depressed
          outlined
          class="mr-2 px-4"
          height="44"
          @click="handleCancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          depressed
          class="white--text px-4"
          height="44"
          @click="handleApply"
        >
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script>
export default {
  name: 'DateRangePicker',
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      menu: false,
      maxDate: new Date(),
    }
  },
  computed: {
    range: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },
  },
  methods: {
    handleApply() {
      this.$emit('apply')
      this.menu = false
    },
    handleCancel() {
      this.$emit('input', {
        start: new Date(this.$moment().startOf('month').toISOString()),
        end: new Date(),
      })
      this.menu = false
    },
    handleClickReset() {
      this.$emit('input', {
        start: new Date(this.$moment().startOf('month').toISOString()),
        end: new Date(),
      })
      this.$emit('apply')
      this.menu = false
    },
  },
}
</script>
<style lang="scss" scoped>
@use '@/assets/scss/abstracts/variables.scss' as v;
//styling container and font weight in v-calendar

.vc-container {
  --primary-200: #e9d7fe !important;
  --primary-600: #7f56d9 !important;
  --primary-700: #6941c6 !important;
  --primary-900: #42307d !important;
  border: none;
}

:deep(.vc-header) {
  margin-bottom: 22px;
  padding-top: 22px;
  .vc-title {
    font-weight: 500 !important;
    color: #344054;
  }
}
:deep(.vc-pane-container) {
  margin: 10px;
  margin-bottom: 0;
}

:deep(.vc-weekday) {
  font-weight: 500 !important;
  color: black !important;
  margin-bottom: 8px;
}

:deep(.vc-day) {
  margin-bottom: 4px;
}

:deep(.vc-day-content) {
  font-weight: 400 !important;
  font-size: 14px !important;
  width: 40px !important;
  height: 40px !important;

  &.is-disabled {
    cursor: not-allowed;
    background-color: none;
    border-color: #667085;
  }

  &:not(.is-disabled):hover {
    background-color: var(--primary-200);
    color: var(--primary-600);
  }
}

:deep(.vc-highlight) {
  width: 40px !important;
  height: 40px !important;
}
</style>
