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
              Daftar untuk membuat akun!
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row :class="smAndDown ? 'mx-2' : 'mx-6'" align="center" justify="center">
      <v-col v-if="!success" class="text-black">
        <v-divider class="mb-4"></v-divider>
        <div
          class="font-weight-medium mb-1 text-gray_700"
          style="font-size: 14px"
        >
          Nama
          <span style="color: red !important">*</span>
        </div>
        <v-text-field
          v-model="form.name"
          variant="outlined"
          density="compact"
          height="44"
          placeholder="Enter your Name"
          :error-messages="
            v$.form.name.required.$invalid && v$.form.name.$dirty
              ? 'Name is required'
              : []
          "
          @blur="v$.form.name.$touch()"
        >
          <template #append>
            <v-icon
              v-if="v$.form.name.$invalid && v$.form.name.$dirty"
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
          Status
        </div>
        <v-select
          v-model="form.status"
          :items="status"
          item-title="name"
          item-value="value"
          variant="outlined"
          density="compact"
          height="44"
          placeholder="Select Status"
        >
        </v-select>

        <div
          class="font-weight-medium mb-1 text-gray_700"
          style="font-size: 14px"
        >
          Email
          <span style="color: red !important">*</span>
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
          <span style="color: red !important">*</span>
        </div>
        <v-text-field
          v-model="form.password"
          variant="outlined"
          type="password"
          density="compact"
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
        <div
          class="font-weight-medium mb-1 text-gray_700"
          style="font-size: 14px"
        >
          Konfirmasi Password
          <span style="color: red !important">*</span>
        </div>
        <v-text-field
          v-model="form.confirmPassword"
          class="mb-4"
          variant="outlined"
          type="password"
          density="compact"
          height="44"
          placeholder="Enter your Password again"
          :error-messages="
            v$.form.confirmPassword.required.$invalid &&
            v$.form.confirmPassword.$dirty
              ? 'Password is required'
              : v$.form.confirmPassword.minLength.$invalid &&
                v$.form.confirmPassword.$dirty
              ? 'Minimum is 6 char'
              : v$.form.confirmPassword.sameAsPassword.$invalid &&
                v$.form.confirmPassword.$dirty
              ? 'Confirm Password must be same as Password'
              : []
          "
          @blur="v$.form.confirmPassword.$touch()"
        >
          <template #append>
            <v-icon
              v-if="
                v$.form.confirmPassword.$invalid &&
                v$.form.confirmPassword.$dirty
              "
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
          @click="handleRegister"
        >
          Daftar
        </v-btn>
      </v-col>
      <v-col v-else cols="auto">
        <span class="font-weight-medium text-primary"
          >Proses pendaftaran berhasil, hubungi admin untuk mengaktifkan
          akun.</span
        >
        <v-btn
          class="text-white rounded-lg mt-4"
          color="primary"
          size="large"
          block
          variant="flat"
          type="submit"
          to="/login"
        >
          Masuk
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email, sameAs } from '@vuelidate/validators'
import { useUserStore } from '@/stores/user'
import { useRoleStore } from '@/stores/role'

defineOptions({ name: 'RegisterForm' })

const { smAndDown } = useDisplay()
const userStore = useUserStore()
const roleStore = useRoleStore()

const form = reactive({
  name: '',
  status: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const status = [
  { name: 'Retail', value: 'retail' },
  { name: 'Sales', value: 'wholesaler' },
]
const success = ref(false)
const loading = ref(false)

const passwordRef = computed(() => form.password)
const rules = {
  form: {
    name: { required },
    email: { required, email },
    password: { required, minLength: minLength(6) },
    confirmPassword: {
      required,
      minLength: minLength(6),
      sameAsPassword: sameAs(passwordRef),
    },
  },
}
const v$ = useVuelidate(rules, { form })

async function handleRegister() {
  loading.value = true
  const body = {
    ...form,
    role: roleStore.roles.find((item) => item.roleName === 'super_admin')
      ?._id,
  }
  const res = await userStore.register(body)
  loading.value = false
  if (res) {
    success.value = true
  }
}
</script>
<style lang="scss" scoped>
:deep(.v-btn) {
  letter-spacing: 0;
}
.round-corner {
  border-radius: 20px;
}
</style>
