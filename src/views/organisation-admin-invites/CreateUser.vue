<template>
  <gov-width-container>
    <ck-loader v-if="loading" />

    <template v-else>
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
          <gov-grid-column width="one-half">
            <gov-heading size="xl">
              <gov-caption size="xl">
                Claim and manage your organisation's listing
              </gov-caption>
              Create an account
            </gov-heading>

            <form @submit.prevent="onSubmit">
              <ck-text-input
                v-model="form.first_name"
                @input="form.$errors.clear('first_name')"
                id="first_name"
                label="First name"
                type="text"
                :error="form.$errors.get('first_name')"
                :disabled="form.$submitting"
              />

              <ck-text-input
                v-model="form.last_name"
                @input="form.$errors.clear('last_name')"
                id="last_name"
                label="Last name"
                type="text"
                :error="form.$errors.get('last_name')"
                :disabled="form.$submitting"
              />

              <ck-text-input
                v-model="form.email"
                @input="form.$errors.clear('email')"
                id="email"
                label="Email"
                type="email"
                :error="form.$errors.get('email')"
                :disabled="form.$submitting"
              />

              <ck-text-input
                v-model="form.phone"
                @input="form.$errors.clear('phone')"
                id="phone"
                label="Phone"
                type="tel"
                :error="form.$errors.get('phone')"
                :disabled="form.$submitting"
              />

              <ck-text-input
                v-model="form.password"
                @input="form.$errors.clear('password')"
                id="password"
                label="Password"
                type="password"
                :error="form.$errors.get('password')"
                :disabled="form.$submitting"
              />

              <ck-text-input
                v-model="form.password_confirmed"
                @input="form.$errors.clear('password_confirmed')"
                id="password_confirmed"
                label="Confirm password"
                type="password"
                :error="form.$errors.get('password_confirmed')"
                :disabled="form.$submitting"
              />

              <gov-section-break size="l" />

              <gov-button v-if="form.$submitting" disabled type="submit">
                Creating account...
              </gov-button>

              <gov-button v-else type="submit">
                Create account
              </gov-button>

              <ck-submit-error v-if="form.$errors.any()" />
            </form>
          </gov-grid-column>
        </gov-grid-row>
      </gov-main-wrapper>
    </template>
  </gov-width-container>
</template>

<script>
import Form from "@/classes/Form"
import axios from "axios";

const http = axios.create({
  baseURL: `${process.env.VUE_APP_API_URI}/core/v1`
});
http.defaults.headers.post["Content-Type"] = "application/json";

export default {
  data() {
    return {
      loading: false,
      organisationAdminInvite: null,
      form: new Form({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmed: ""
      }, {}, http)
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
    },

    onSubmit() {
      if (this.form.password !== this.form.password_confirmed) {
        this.form.onFail({
          errors: {
            password_confirmed: ["The password does not match."]
          }
        });
        return;
      }

      alert('Submitted');
    }
  },

  created() {
    this.fetchOrganisationAdminInvites();
  }
}
</script>
