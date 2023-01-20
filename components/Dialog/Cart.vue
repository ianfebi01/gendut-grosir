<template>
  <v-dialog v-model="modal" persistent :width="width" scrollable>
    <v-card style="border-radius: 12px !important" min-height="542">
      <v-card-title
        class="d-flex flex-column justify-center letter-spacing-normal mb-2"
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
        <slot name="content">
          <v-list v-if="datas.length" two-line>
            <v-list-item
              v-for="item in datas"
              :key="item?._id"
              class="border mb-2"
            >
              <v-list-item-avatar
                height="50"
                width="50"
                style="border-radius: 8px"
              >
                <v-img lazy-src="lazy-loader.svg" :src="item?.image"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title
                  class="gray_900--text text-16 font-weight-medium mb-2"
                  >{{ item?.name }}</v-list-item-title
                >
                <div class="action">
                  <v-btn
                    small
                    fab
                    depressed
                    color="primary_300"
                    outlined
                    @click="handleMinus(item?._id)"
                  >
                    <v-icon class="qty" size="15">mdi-minus</v-icon>
                  </v-btn>

                  <span class="font-weight-bold mx-2 text-16">{{
                    item?.qty
                  }}</span>

                  <v-btn
                    small
                    fab
                    depressed
                    color="primary_300"
                    outlined
                    @click="handlePlus(item?._id)"
                  >
                    <v-icon class="qty" size="15">mdi-plus</v-icon>
                  </v-btn>
                </div>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  depressed
                  small
                  fab
                  text
                  @click="handleDelete(item?._id)"
                >
                  <v-icon size="15">$trash</v-icon>
                </v-btn>
                <v-list-item-title class="font-weight-bold text-14">
                  {{
                    customerStatus === 'retailPrice'
                      ? formatRupiah(item?.retailPrice)
                      : formatRupiah(item?.wholesalerPrice)
                  }}
                </v-list-item-title>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <Empty
            v-else
            img="/girl-shop.svg"
            title="Cart is Empty"
            description="Please add Product to cart first!"
            padding="px-0"
            gap-bottom="mb-0"
          />
        </slot>
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
              :disabled="!datas.length"
              @click="handleChekout"
            >
              Checkout
            </v-btn>
          </v-col>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Snackbar from '../Snackbar/Snackbar.vue'
import { formatRupiah } from '~/utils/formatRupiah'
import Empty from '../Layout/Empty.vue'

export default {
  name: 'Modal',
  components: { Snackbar, Empty },
  props: {
    modalProp: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '$cart',
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
    datas: {
      type: Array,
      default: () => [],
    },
    customerStatus: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      model: null,
    }
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
    formatRupiah(item) {
      return formatRupiah(item)
    },
    handlePlus(id) {
      this.$store.dispatch('order/plus', id)
    },
    handleMinus(id) {
      this.$store.dispatch('order/minus', id)
    },
    handleDelete(id) {
      this.$store.dispatch('order/delete', id)
    },
    handleChekout() {},
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
.border {
  border: 1px solid v.$primary_300;
  border-radius: 8px !important;
}
:deep(.action .v-btn) {
  min-width: unset !important;
  min-height: unset !important;
  height: unset !important;
  width: unset !important;
}
</style>
