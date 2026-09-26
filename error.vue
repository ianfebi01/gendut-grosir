<template>
  <NuxtLayout>
    <v-app>
      <v-main>
        <v-container class="fill-height">
          <v-row align="center" justify="center">
            <v-col cols="12" class="text-center">
              <h1 v-if="error?.statusCode === 404">
                {{ pageNotFound }}
              </h1>
              <h1 v-else>
                {{ otherError }}
              </h1>
              <NuxtLink to="/">Home page</NuxtLink>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </NuxtLayout>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: null,
  },
})

const pageNotFound = '404 Not Found'
const otherError = 'An error occurred'

const title = computed(() =>
  props.error?.statusCode === 404 ? pageNotFound : otherError
)

useHead({ title })
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
