<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Create User`" />

    <gov-back-link
      :to="{
        name: 'organisation-admin-invites-start',
        params: { organisationAdminInvite: organisationAdminInvite.id }
      }"
    >
      Back
    </gov-back-link>

    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="two-thirds">
          <gov-heading size="xl">Login</gov-heading>

          <gov-body>
            Lorem ipsum.
          </gov-body>
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
export default {
  data() {
    return {
      // TODO
      organisationAdminInvite: {
        id: this.$route.params.organisationAdminInvite
      }
    }
  }
}
</script>
