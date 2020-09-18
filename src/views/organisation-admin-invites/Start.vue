<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Claim Organisation`" />

    <gov-main-wrapper>
      <ck-loader v-if="loading" />

      <gov-grid-row v-else>
        <gov-grid-column width="two-thirds">
          <gov-heading size="xl">
            Claim and manage your organisation's listing
          </gov-heading>

          <gov-body>
            So we're ready to start signing your organisation up to NHS Connect.
            The first part of the process takes just a few minutes.
          </gov-body>

          <gov-body>
            This service is completely free, will improve your organisation's
            profile, give you access to new funding opportunities and help
            improve people's access to the support you offer.
          </gov-body>

          <gov-heading size="l">
            Step by step
          </gov-heading>

          <gov-list type="ordered" number>
            <li>Create an account</li>
            <li>Review your data</li>
            <li>Adding service(s)</li>
            <li>Manage account</li>
          </gov-list>

          <gov-button
            :to="{
              name: 'organisation-admin-invites-create-user',
              params: { organisationAdminInvite: organisationAdminInvite.id }
            }"
            start
          >
            Start now
          </gov-button>
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
import axios from "axios";

const http = axios.create({
  baseURL: `${process.env.VUE_APP_API_URI}/core/v1`
});
http.defaults.headers.post["Content-Type"] = "application/json";

export default {
  data() {
    return {
      loading: false,
      organisationAdminInvite: null
    }
  },

  methods: {
    async fetchOrganisationAdminInvites() {
      this.loading = true;

      try {
        const {
          data: {
            data: organisationAdminInvite
          }
        } = await http.get(`/organisation-admin-invites/${this.$route.params.organisationAdminInvite}`)

        this.organisationAdminInvite = organisationAdminInvite
      } catch (e) {
        this.$router.push("/404");
      }

      this.loading = false;
    }
  },

  created() {
  this.fetchOrganisationAdminInvites();
  }
}
</script>
