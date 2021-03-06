<template>
  <div>
    <vue-headful :title="`${appName} - Admin: CMS`" />

    <gov-heading size="l">Frontend</gov-heading>

    <ck-loader v-if="loading" />
    <template v-else>
      <gov-error-summary v-if="settings.$errors.any()" title="Check for errors">
        <gov-list>
          <li v-for="(error, field) in settings.$errors.all()" :key="field" v-text="error[0]" />
        </gov-list>
      </gov-error-summary>

      <gov-tabs :tabs="tabs">
        <router-view
          v-model="settings.cms.frontend"
          :errors="settings.$errors"
          @clear="settings.$errors.clear(`cms.${$event}`)"
        />
      </gov-tabs>

      <gov-button v-if="settings.$submitting" disabled type="submit">Updating...</gov-button>
      <gov-button v-else @click="onSubmit" type="submit">Update</gov-button>
      <ck-submit-error v-if="settings.$errors.any()" />
    </template>
  </div>
</template>

<script>
import http from "@/http";
import Form from "@/classes/Form";

export default {
  name: "Cms",

  data() {
    return {
      tabs: [
        {
          heading: "Global",
          to: { name: "admin-index-cms" }
        },
        {
          heading: "Home",
          to: { name: "admin-index-cms-frontend-home" }
        },
        {
          heading: "Terms and Conditions",
          to: { name: "admin-index-cms-frontend-terms-and-conditions" }
        },
        {
          heading: "Privacy Policy",
          to: { name: "admin-index-cms-frontend-privacy-policy" }
        },
        {
          heading: "About Connect",
          to: {
            name: "admin-index-cms-frontend-page",
            params: { pageSlug: "about", pageTitle: "About Connect" }
          }
        },
        {
          heading: "Providers",
          to: {
            name: "admin-index-cms-frontend-page",
            params: { pageSlug: "providers", pageTitle: "Providers" }
          }
        },
        {
          heading: "Supporters",
          to: {
            name: "admin-index-cms-frontend-page",
            params: { pageSlug: "supporters", pageTitle: "Supporters" }
          }
        },
        {
          heading: "Funders",
          to: {
            name: "admin-index-cms-frontend-page",
            params: { pageSlug: "funders", pageTitle: "Funders" }
          }
        },
        {
          heading: "Contact",
          to: { name: "admin-index-cms-frontend-contact" }
        },
        {
          heading: "Favourites",
          to: { name: "admin-index-cms-frontend-favourites" }
        }
      ],
      settings: null,
      loading: false
    };
  },

  created() {
    this.fetchSettings();
  },

  methods: {
    async fetchSettings() {
      this.loading = true;

      const {
        data: { data: settings }
      } = await http.get("/settings");
      this.settings = new Form(settings);

      this.loading = false;
    },

    async onSubmit() {
      await this.settings.put("/settings");
      this.$router.push({ name: "admin-index-cms-updated" });
    }
  }
};
</script>
