<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - List Support listings`" />

    <gov-back-link :to="{ name: 'dashboard' }">Back to dashboard</gov-back-link>

    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">

          <gov-heading size="xl">Support listings</gov-heading>

          <gov-grid-row>
            <gov-grid-column width="two-thirds">
              <ck-table-filters @search="onSearch">
                <gov-form-group>
                  <gov-label for="filter[name]">Support listing name</gov-label>
                  <gov-input v-model="filters.name" id="filter[name]" name="filter[name]" type="search"/>
                </gov-form-group>

                <template slot="extra-filters">
                  <gov-form-group>
                    <gov-label for="filter[organisation_name]">Organisation name</gov-label>
                    <gov-input v-model="filters.organisation_name" id="filter[organisation_name]" name="filter[organisation_name]" type="search"/>
                  </gov-form-group>

                  <gov-form-group>
                    <gov-label for="filter[status]">Status</gov-label>
                    <gov-select v-model="filters.status" id="filter[status]" name="filter[status]" :options="statuses"/>
                  </gov-form-group>

                  <gov-form-group>
                    <gov-label for="filter[referral_method]">Referral method</gov-label>
                    <gov-select v-model="filters.referral_method" id="filter[referral_method]" name="filter[referral_method]" :options="referralMethods"/>
                  </gov-form-group>

                  <gov-form-group>
                    <gov-label for="filter[is_national]">National</gov-label>
                    <gov-select v-model="filters.is_national" id="filter[is_national]" name="filter[is_national]" :options="nationalOptions"/>
                  </gov-form-group>

                  <gov-form-group>
                    <gov-label for="filter[has_category_taxonomies]">
                      Has Taxonomies
                    </gov-label>
                    <gov-select
                      v-model="filters.has_category_taxonomies"
                      id="filter[has_category_taxonomies]"
                      name="filter[has_category_taxonomies]"
                      :options="hasCategoryTaxonomiesOptions"
                    />
                  </gov-form-group>
                </template>
              </ck-table-filters>
            </gov-grid-column>
            <gov-grid-column v-if="auth.isOrganisationAdmin() || auth.isLocalAdmin" width="one-third">
              <gov-button @click="onAddService" type="submit" success expand>Add support listing</gov-button>
              <gov-button :to="{name: 'services-import'}" type="submit" success expand>Bulk import</gov-button>
            </gov-grid-column>
          </gov-grid-row>

          <ck-resource-listing-table
            ref="servicesTable"
            uri="/services"
            :params="params"
            default-sort="name"
            :columns="[
              { heading: 'Support listing name', sort: 'name' },
              { heading: 'Organisation', sort: 'organisation_name' },
              { heading: 'Status' },
              { heading: 'Referral method' },
              { heading: 'National?' },
            ]"
            :view-route="(service) => {
              return {
                name: 'services-show',
                params: { service: service.id }
              }
            }"
          >
            <template slot="cell:0" slot-scope="{ resource: service }">
              {{ service.name }}
            </template>
            <template slot="cell:1" slot-scope="{ resource: service }">
              {{ service.organisation.name }}
            </template>
            <template slot="cell:2" slot-scope="{ resource: service }">
              {{ displayStatus(service.status) }}
            </template>
            <template slot="cell:3" slot-scope="{ resource: service }">
              {{ displayReferralMethod(service.referral_method) }}
            </template>
            <template slot="cell:4" slot-scope="{ resource: service }">
              {{ service.is_national ? 'Yes' : 'No' }}
            </template>
          </ck-resource-listing-table>

        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
import CkResourceListingTable from "@/components/Ck/CkResourceListingTable.vue";
import CkTableFilters from "@/components/Ck/CkTableFilters.vue";

export default {
  name: "ListServices",
  components: { CkResourceListingTable, CkTableFilters },
  data() {
    return {
      filters: {
        name: "",
        organisation_name: "",
        status: "",
        referral_method: "",
        is_national: "",
        has_category_taxonomies: ""
      },
      statuses: [
        { value: "", text: "All" },
        { value: "active", text: "Enabled" },
        { value: "inactive", text: "Disabled" }
      ],
      referralMethods: [
        { value: "", text: "All" },
        { value: "internal", text: "Internal" },
        { value: "external", text: "External" },
        { value: "none", text: "None" }
      ],
      nationalOptions: [
        { value: "", text: "All" },
        { value: true, text: "National" },
        { value: false, text: "Local" }
      ],
      hasCategoryTaxonomiesOptions: [
        { value: "", text: "All" },
        { value: true, text: "Yes" },
        { value: false, text: "No" }
      ]
    };
  },
  computed: {
    params() {
      const params = {
        include: "organisation",
        "filter[has_permission]": true
      };

      if (this.filters.name !== "") {
        params["filter[name]"] = this.filters.name;
      }

      if (this.filters.organisation_name !== "") {
        params["filter[organisation_name]"] = this.filters.organisation_name;
      }

      if (this.filters.status !== "") {
        params["filter[status]"] = this.filters.status;
      }

      if (this.filters.referral_method !== "") {
        params["filter[referral_method]"] = this.filters.referral_method;
      }

      if (this.filters.is_national !== "") {
        params["filter[is_national]"] = this.filters.is_national;
      }

      if (this.filters.has_category_taxonomies !== "") {
        params[
          "filter[has_category_taxonomies]"
        ] = this.filters.has_category_taxonomies;
      }

      return params;
    }
  },
  methods: {
    onSearch() {
      this.$refs.servicesTable.currentPage = 1;
      this.$refs.servicesTable.fetchResources();
    },
    onAddService() {
      this.$router.push({ name: "services-pre-create" });
    },
    displayStatus(status) {
      switch (status) {
        case "active":
          return "Enabled";
        case "inactive":
          return "Disabled";
        default:
          return status;
      }
    },
    displayReferralMethod(referralMethod) {
      return referralMethod.charAt(0).toUpperCase() + referralMethod.substr(1);
    }
  }
};
</script>
