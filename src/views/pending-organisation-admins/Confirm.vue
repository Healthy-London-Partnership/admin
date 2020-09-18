<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Confirm Email`" />

    <gov-main-wrapper>
      <ck-loader v-if="confirming">Confirming</ck-loader>

      <gov-grid-row v-else>
        <gov-grid-column width="two-thirds">
          <gov-heading size="xl">
            Congratulations! You are live on NHS Connect!
          </gov-heading>

          <gov-body>
            You're all set to go! Let's help improve people's access to the
            support you offer.
          </gov-body>

          <gov-heading size="l">
            Review your organisation's details
          </gov-heading>

          <gov-body>
            We recommend a quick check of your organisation's details and then
            going straight on to adding once service. Maybe start with the
            service that's easiest to describe or that you know best.
          </gov-body>

          <gov-heading size="l">
            Add a service
          </gov-heading>

          <gov-body>
            Once you've added one service, your listing will be live and can be
            viewed by GPs and other professionals who might want to make
            referrals, plus people who access NHS Connect through a wide range
            of different websites and social media channels.
          </gov-body>

          <gov-body>
            You can also set your listing up to accept referrals via Connect, or
            of course direct people to existing referral systems that you accept
            (or reject) to use.
          </gov-body>

          <gov-button :to="{ name: 'login' }">
            Go to your account
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
      confirming: false
    }
  },

  methods: {
    async confirmPendingOrganisationAdmin() {
      this.confirming = true;

      try {
        await http.post(`/pending-organisation-admins/${this.$route.params.pendingOrganisationAdmin}/confirm`);
      } catch (e) {
        this.$router.push("/404");
      }

      this.confirming = false;
    }
  },

  created() {
    this.confirmPendingOrganisationAdmin();
  }
}
</script>
