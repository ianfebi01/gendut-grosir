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
      <v-col v-if="!success" class="text-black">
        <v-divider class="mb-4"></v-divider>
        <div
          class="font-weight-medium mb-1 gray_700--text"
          style="font-size: 14px"
        >
          Name
          <span style="color: red !important">*</span>
        </div>
        <v-text-field
          v-model="form.name"
          outlined
          dense
          flat
          height="44"
          placeholder="Enter your Name"
          :error-messages="
            !$v.form.name.required && $v.form.name.$dirty
              ? 'Name is required'
              : []
          "
          @blur="$v.form.name.$touch()"
          ><template slot="append">
            <v-icon
              v-if="$v.form.name.$invalid && $v.form.name.$dirty"
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
          Status
        </div>
        <v-select
          v-model="form.status"
          :items="status"
          item-text="name"
          item-value="value"
          outlined
          dense
          flat
          height="44"
          placeholder="Select Status"
        >
        </v-select>

        <div
          class="font-weight-medium mb-1 gray_700--text"
          style="font-size: 14px"
        >
          Email
          <span style="color: red !important">*</span>
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
          <span style="color: red !important">*</span>
        </div>
        <v-text-field
          v-model="form.password"
          outlined
          type="password"
          dense
          flat
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
        <div
          class="font-weight-medium mb-1 gray_700--text"
          style="font-size: 14px"
        >
          Confirm Password
          <span style="color: red !important">*</span>
        </div>
        <v-text-field
          v-model="form.confirmPassword"
          class="mb-4"
          outlined
          type="password"
          dense
          flat
          height="44"
          placeholder="Enter your Password again"
          :error-messages="
            !$v.form.confirmPassword.required && $v.form.confirmPassword.$dirty
              ? 'Password is required'
              : !$v.form.confirmPassword.minLength &&
                $v.form.confirmPassword.$dirty
              ? 'Minimum is 6 char'
              : !$v.form.confirmPassword.sameAsPassword &&
                $v.form.confirmPassword.$dirty
              ? 'Confirm Password must be same as Password'
              : []
          "
          @blur="$v.form.confirmPassword.$touch()"
        >
          <template slot="append">
            <v-icon
              v-if="
                $v.form.confirmPassword.$invalid &&
                $v.form.confirmPassword.$dirty
              "
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
          @click="handleRegister"
        >
          Sign Up
        </v-btn>
      </v-col>
      <v-col v-else cols="auto">
        <span class="font-weight-medium primary--text"
          >Regiter success, please confirm your email.</span
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      form: {
        name: '',
        status: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      status: [
        { name: 'Retail', value: 'retail' },
        { name: 'Sales', value: 'wholesaler' },
        { name: 'None', value: null },
      ],
      success: false,
      loading: false,
    }
  },
  methods: {
    async handleRegister() {
      this.loading = true
      const body = {
        ...this.form,
      }
      const res = await this.$store.dispatch('user/register', body)
      if (res) {
        this.success = true
        this.loading = false
      } else {
        this.loading = false
      }
    },
  },
  validations() {
    return {
      form: {
        name: { required },
        email: { required, email },
        password: { required, minLength: minLength(6) },
        confirmPassword: {
          required,
          minLength: minLength(6),
          sameAsPassword: sameAs('password'),
        },
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
