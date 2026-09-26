<template>
  <v-container fluid class="px-0">
    <v-row :class="smAndDown ? 'mx-2' : 'mx-6'">
      <v-col cols="12" class="text-center">
        <div style="margin-bottom: 16px" class="d-flex justify-center">
          <img src="/logo.svg" alt="Gendut Grosir" style="height: 64px" />
        </div>
        <v-row>
          <v-col>
            <div
              class="font-weight-light text-neutral-70"
              style="font-size: 14px"
            >
              Masuk dengan akun Anda dan selamat berbelanja!
            </div>
            <div
              v-if="errorMessage"
              class="font-weight-medium mt-2 text-error"
              style="font-size: 14px"
            >
              {{ 'Error: ' + errorMessage }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row :class="smAndDown ? 'mx-2' : 'mx-6'" align="center" justify="center">
      <v-col class="text-black">
        <form @submit.prevent>
          <v-divider class="mb-4"></v-divider>
          <div
            class="font-weight-medium mb-1 text-gray_700"
            style="font-size: 14px"
          >
            Email
          </div>
          <v-text-field
            v-model="form.email"
            variant="outlined"
            density="compact"
            height="44"
            placeholder="Enter your Email"
            :error-messages="
              v$.form.email.required.$invalid && v$.form.email.$dirty
                ? 'Email is required'
                : v$.form.email.email.$invalid && v$.form.email.$dirty
                ? 'Please insert valid email address'
                : []
            "
            @blur="v$.form.email.$touch()"
          >
            <template #append>
              <v-icon
                v-if="v$.form.email.$invalid && v$.form.email.$dirty"
                color="red"
              >
                mdi-alert-circle-outline
              </v-icon>
            </template>
          </v-text-field>
          <div
            class="font-weight-medium mb-1 text-gray_700"
            style="font-size: 14px"
          >
            Password
          </div>
          <v-text-field
            v-model="form.password"
            class="mb-4"
            variant="outlined"
            density="compact"
            type="password"
            height="44"
            placeholder="Enter your Password"
            :error-messages="
              v$.form.password.required.$invalid && v$.form.password.$dirty
                ? 'Password is required'
                : v$.form.password.minLength.$invalid && v$.form.password.$dirty
                ? 'Minimum is 6 char'
                : []
            "
            @blur="v$.form.password.$touch()"
          >
            <template #append>
              <v-icon
                v-if="v$.form.password.$invalid && v$.form.password.$dirty"
                color="red"
              >
                mdi-alert-circle-outline
              </v-icon>
            </template>
          </v-text-field>
          <v-btn
            :class="
              smAndDown
                ? 'text-white rounded-lg mb-4'
                : 'text-white rounded-lg mb-4'
            "
            color="primary"
            size="large"
            block
            variant="flat"
            type="submit"
            :disabled="v$.form.$invalid"
            :loading="loading"
            @click="emit('handleLogin', form)"
          >
            Masuk
          </v-btn>
          <!-- <v-divider class="mb-4"></v-divider>
        <v-btn
          href="http://localhost:8000/auth/facebook"
          :class="
            smAndDown
              ? 'text-white rounded-lg mb-4'
              : 'text-white rounded-lg'
          "
          color="#4267B2"
          size="large"
          block
          variant="flat"
          :loading="loading"
          @click="loading = true"
        >
          <v-icon class="mr-2">mdi-facebook</v-icon>
          Sign In With Facebook
        </v-btn> -->
          <v-list-item>
            <v-list-item-title class="text-center"
              >Tidak punya akun?
              <NuxtLink to="/register" class="text-primary"
                >Daftar</NuxtLink
              >
            </v-list-item-title>
          </v-list-item>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email } from '@vuelidate/validators'
import { useUserStore } from '@/stores/user'

defineOptions({ name: 'LoginForm' })

const props = defineProps({
  loadingProps: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['handleLogin', 'setLoading'])

const { smAndDown } = useDisplay()
const userStore = useUserStore()

const form = reactive({
  email: '',
  password: '',
})

const rules = {
  form: {
    email: { required, email },
    password: { required, minLength: minLength(6) },
  },
}
const v$ = useVuelidate(rules, { form })

const loading = computed({
  get: () => props.loadingProps,
  set: (newVal) => emit('setLoading', newVal),
})
const errorMessage = computed(() => userStore.errorMessage)
</script>
<style lang="scss" scoped>
:deep(.v-btn) {
  letter-spacing: 0;
}
.round-corner {
  border-radius: 20px;
}
</style>
