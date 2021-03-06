<template>
  <gov-table>
    <template slot="body">
      <gov-table-row>
        <gov-table-header top scope="row">First name</gov-table-header>
        <gov-table-cell>{{ user.first_name }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Last name</gov-table-header>
        <gov-table-cell>{{ user.last_name }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Email</gov-table-header>
        <gov-table-cell>{{ user.email }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Phone number</gov-table-header>
        <gov-table-cell>{{ user.phone }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row v-if="auth.isSuperAdmin">
        <gov-table-header top scope="row">Name of Employer</gov-table-header>
        <gov-table-cell>{{ user.employer_name }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row v-if="auth.isSuperAdmin">
        <gov-table-header scope="row">Address</gov-table-header>
        <gov-table-cell v-if="user.address">{{addressString}}</gov-table-cell>
        <gov-table-cell v-else>No address for this User</gov-table-cell>
      </gov-table-row>
      <gov-table-row v-if="auth.isSuperAdmin">
        <gov-table-header scope="row">Local Authority</gov-table-header>
        <gov-table-cell v-if="user.local_authority">{{localAuthorityName}}</gov-table-cell>
        <gov-table-cell v-else>No Local Authority for this User</gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Permissions</gov-table-header>
        <gov-table-cell>
          <gov-list>
            <li>Super admin: {{ superAdmin ? 'Yes' : 'No' }}</li>
            <li>Global admin: {{ globalAdmin ? 'Yes' : 'No' }}</li>
            <li>Local admin: {{ localAdmin ? 'Yes' : 'No' }}</li>
            <li>
              <template v-if="organisationAdmin.length === 0">Organisation admin: No</template>
              <gov-details v-else summary="Organisation admin: Yes" class="no-margin">
                <div v-for="(role, key) in organisationAdmin" :key="key">
                  <gov-link
                    :to="{ name: 'organisations-show', params: { organisation: role.organisation_id } }"
                    v-text="role.organisation.name"
                  />
                </div>
              </gov-details>
            </li>
            <li>
              <template v-if="serviceAdmin.length === 0">Support listing admin: No</template>
              <gov-details v-else summary="Support Listing admin: Yes" class="no-margin">
                <div v-for="(role, key) in serviceAdmin" :key="key">
                  <gov-link
                    :to="{ name: 'services-show', params: { service: role.service_id } }"
                    v-text="role.service.name"
                  />
                </div>
              </gov-details>
            </li>
            <li>
              <template v-if="serviceWorker.length === 0">Support listing worker: No</template>
              <gov-details v-else summary="Support Listing worker: Yes" class="no-margin">
                <div v-for="(role, key) in serviceWorker" :key="key">
                  <gov-link
                    :to="{ name: 'services-show', params: { service: role.service_id } }"
                    v-text="role.service.name"
                  />
                </div>
              </gov-details>
            </li>
          </gov-list>
        </gov-table-cell>
      </gov-table-row>
    </template>
  </gov-table>
</template>

<script>
export default {
  name: "CkUserDetails",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      superAdmin: false,
      globalAdmin: false,
      localAdmin: false,
      organisationAdmin: [],
      serviceAdmin: [],
      serviceWorker: []
    };
  },
  methods: {
    sortRoles() {
      this.superAdmin = false;
      this.globalAdmin = false;
      this.organisationAdmin = [];
      this.serviceAdmin = [];
      this.serviceWorker = [];

      this.user.roles.forEach(role => {
        if (role.role === "Super Admin") {
          this.superAdmin = true;
        } else if (role.role === "Global Admin") {
          this.globalAdmin = true;
        } else if (role.role === "Local Admin") {
          this.localAdmin = true;
        } else if (role.hasOwnProperty("organisation")) {
          this.organisationAdmin.push(role);
        } else if (
          role.hasOwnProperty("service") &&
          role.role === "Service Admin"
        ) {
          this.serviceAdmin.push(role);
        } else if (
          role.hasOwnProperty("service") &&
          role.role === "Service Worker"
        ) {
          this.serviceWorker.push(role);
        }
      });
    }
  },
  computed: {
    addressString() {
      const address = [];
      const fields = [
        "address_line_1",
        "address_line_2",
        "address_line_3",
        "city",
        "county",
        "postcode"
      ];
      if (this.user.address) {
        for (const key in this.user.address) {
          if (
            this.user.address.hasOwnProperty(key) &&
            this.user.address[key] &&
            fields.includes(key)
          ) {
            address.push(this.user.address[key]);
          }
        }
      }
      return address.join(", ");
    },
    localAuthorityName() {
      const nameParts = [];
      if (this.user.local_authority) {
        nameParts.push(this.user.local_authority.name);
        if (this.user.local_authority.alt_name) {
          nameParts.push(`(${this.user.local_authority.alt_name})`);
        }
      }
      return nameParts.join(" ");
    }
  },
  created() {
    this.sortRoles();
  }
};
</script>
