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
              Masuk dengan akun Anda dan selamat berbelanja!
            </div>
            <div
              v-if="errorMessage"
              class="font-weight-medium mt-2 error--text"
              style="font-size: 14px"
            >
              {{ 'Error: ' + errorMessage }}
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
        <form @submit.prevent>
          <v-divider class="mb-4"></v-divider>
          <div
            class="font-weight-medium mb-1 gray_700--text"
            style="font-size: 14px"
          >
            Email
          </div>
          <v-text-field
            v-model="form.email"
            outlined
            dense
            flat
            height="44"
            placeholder="Enter your Email"
            :error-messages="
              !$v.form.email.required && $v.form.email.$dirty
                ? 'Email is required'
                : !$v.form.email.email && $v.form.email.$dirty
                ? 'Please insert valid email address'
                : []
            "
            @blur="$v.form.email.$touch()"
            ><template slot="append">
              <v-icon
                v-if="$v.form.email.$invalid && $v.form.email.$dirty"
                color="red"
              >
                mdi-alert-circle-outline
              </v-icon>
            </template></v-text-field
          >
          <div
            class="font-weight-medium mb-1 gray_700--text"
            style="font-size: 14px"
          >
            Password
          </div>
          <v-text-field
            v-model="form.password"
            class="mb-4"
            outlined
            dense
            flat
            type="password"
            height="44"
            placeholder="Enter your Password"
            :error-messages="
              !$v.form.password.required && $v.form.password.$dirty
                ? 'Password is required'
                : !$v.form.password.minLength && $v.form.password.$dirty
                ? 'Minimum is 6 char'
                : []
            "
            @blur="$v.form.password.$touch()"
          >
            <template slot="append">
              <v-icon
                v-if="$v.form.password.$invalid && $v.form.password.$dirty"
                color="red"
              >
                mdi-alert-circle-outline
              </v-icon>
            </template>
          </v-text-field>
          <v-btn
            :class="
              $vuetify.breakpoint.smAndDown
                ? 'white--text rounded-lg mb-4'
                : 'white--text rounded-lg mb-4'
            "
            color="primary"
            large
            block
            depressed
            type="submit"
            :disabled="$v.form.$invalid"
            :loading="loading"
            @click="$emit('handleLogin', form)"
          >
            Masuk
          </v-btn>
          <!-- <v-divider class="mb-4"></v-divider>
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
          :loading="loading"
          @click="loading = true"
        >
          <v-icon class="mr-2">mdi-facebook</v-icon>
          Sign In With Facebook
        </v-btn> -->
          <v-list-item>
            <v-list-item-title class="text-center"
              >Tidak punya akun?
              <nuxt-link to="/register" class="primary--text">Daftar</nuxt-link>
            </v-list-item-title>
          </v-list-item>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { required, minLength, email } from 'vuelidate/lib/validators'
export default {
  props: {
    loadingProps: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    }
  },
  computed: {
    loading: {
      get() {
        return this.loadingProps
      },
      set(newVal) {
        this.$emit('setLoading', newVal)
      },
    },
    errorMessage() {
      return this.$store.get('user/errorMessage')
    },
  },

  validations() {
    return {
      form: {
        email: { required, email },
        password: { required, minLength: minLength(6) },
      },
    }
  },
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
