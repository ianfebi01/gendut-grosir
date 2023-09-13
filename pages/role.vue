<template>
  <v-container fluid class="full-width-height gray_100">
    <page-header
      title="Role"
      subtitle="Kelola role akses"
      :actions="false"
      :search-bar="false"
    />

    <v-row class="px-6 pt-4">
      <div class="row-content pa-4">
        <h1 class="gray_900--text text-24 font-weight-regular">
          Kelola Hak Akses
        </h1>

        <div class="mt-6">
          <template v-for="item in roles">
            <span :key="item?.id" class="font-weight-medium">{{
              item.title
            }}</span>
            <v-row :key="item?._id" dense class="mt-2 gap-4 mb-4">
              <v-col cols="2">
                <v-checkbox
                  id="super_admin"
                  v-model="role[item.roleName]"
                  label="Point Of Sales"
                  value="pos"
                  hide-details
                  :disabled="item.roleName === 'super_admin'"
                  @change="updateRole(item?._id, role[item.roleName])"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  id="super_admin"
                  v-model="role[item.roleName]"
                  label="Library"
                  value="library"
                  hide-details
                  :disabled="item.roleName === 'super_admin'"
                  @change="updateRole(item?._id, role[item.roleName])"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  id="super_admin"
                  v-model="role[item.roleName]"
                  label="Orders"
                  value="orders"
                  hide-details
                  :disabled="item.roleName === 'super_admin'"
                  @change="updateRole(item?._id, role[item.roleName])"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  id="super_admin"
                  v-model="role[item.roleName]"
                  label="Dashboard"
                  value="dashboard"
                  hide-details
                  :disabled="item.roleName === 'super_admin'"
                  @change="updateRole(item?._id, role[item.roleName])"
                ></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  id="super_admin"
                  v-model="role[item.roleName]"
                  label="Role Management"
                  value="role"
                  hide-details
                  :disabled="item.roleName === 'super_admin'"
                  @change="updateRole(item?._id, role[item.roleName])"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  id="super_admin"
                  v-model="role[item.roleName]"
                  label="Customers"
                  value="customers"
                  hide-details
                  :disabled="item.roleName === 'super_admin'"
                  @change="updateRole(item?._id, role[item.roleName])"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  id="super_admin"
                  v-model="role[item.roleName]"
                  label="Product"
                  value="product"
                  hide-details
                  :disabled="item.roleName === 'super_admin'"
                  @change="updateRole(item?._id, role[item.roleName])"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  id="super_admin"
                  v-model="role[item.roleName]"
                  label="Category"
                  value="category"
                  hide-details
                  :disabled="item.roleName === 'super_admin'"
                  @change="updateRole(item?._id, role[item.roleName])"
                ></v-checkbox>
              </v-col>
              <v-col cols="2">
                <v-checkbox
                  id="super_admin"
                  v-model="role[item.roleName]"
                  label="Stock Opname"
                  value="stockOpname"
                  hide-details
                  :disabled="item.roleName === 'super_admin'"
                  @change="updateRole(item?._id, role[item.roleName])"
                ></v-checkbox>
              </v-col>
            </v-row>
          </template>
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import PageHeader from '~/components/Layout/PageHeader.vue'

export default {
  name: 'Role',
  components: { PageHeader },
  layout: 'dashboard',
  data() {
    return {
      role: {
        super_admin: [],
      },
    }
  },
  computed: {
    roles() {
      return this.$store.get('role/roles')
    },
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    async getRoles(q) {
      const params = {
        q,
      }
      const res = await this.$store.dispatch('role/getRoles', params)

      if (res) {
        this.roles.map((item) => {
          this.role[item.roleName] = item.allows
        })
      }
    },
    async updateRole(id, allows) {
      const params = {
        id,
        allows,
      }

      await this.$store.dispatch('role/updateRole', params)
    },
  },
}
</script>

<style lang="scss" scoped>
:deep(.v-input--selection-controls) {
  margin-top: 0 !important;
}
</style>
