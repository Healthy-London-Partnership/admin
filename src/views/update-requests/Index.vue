<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - List Update Requests`" />

    <gov-back-link :to="{ name: 'dashboard' }">Back to dashboard</gov-back-link>
    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">

          <gov-heading size="xl">Update requests</gov-heading>

          <gov-grid-row>
            <gov-grid-column width="two-thirds">
              <ck-table-filters @search="onSearch" hide-extra>
                <gov-form-group>
                  <gov-label for="filter[entry]">Entry</gov-label>
                  <gov-input v-model="filters.entry" id="filter[entry]" name="filter[entry]" type="search"/>
                </gov-form-group>
              </ck-table-filters>
            </gov-grid-column>
          </gov-grid-row>

          <ck-resource-listing-table
            ref="updateRequestsTable"
            uri="/update-requests"
            :params="params"
            default-sort="-created_at"
            :columns="[
              { heading: 'User' },
              { heading: 'Type' },
              { heading: 'Entry', sort: 'entry' },
              { heading: 'Date / Time', sort: 'created_at' },
            ]"
            :view-route="(updateRequest) => {
              return {
                name: 'update-requests-show',
                params: { updateRequest: updateRequest.id }
              }
            }"
          >
            <template slot="cell:0" scope="{ resource: updateRequest }">
              {{ updateRequest.user ? `${updateRequest.user.first_name} ${updateRequest.user.last_name}` : 'N/A' }}
            </template>
            <template slot="cell:1" scope="{ resource: updateRequest }">
              {{ displayType(updateRequest.updateable_type) }}
            </template>
            <template slot="cell:2" scope="{ resource: updateRequest }">
              {{ updateRequest.entry }}
            </template>
            <template slot="cell:3" scope="{ resource: updateRequest }">
              {{ formatDateTime(updateRequest.created_at) }}
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
  name: "ListUpdateRequests",
  components: { CkResourceListingTable, CkTableFilters },
  data() {
    return {
      filters: {
        entry: ""
      }
    };
  },
  computed: {
    params() {
      const params = {
        include: "user"
      };

      if (this.filters.entry !== "") {
        params["filter[entry]"] = this.filters.entry;
      }

      return params;
    }
  },
  methods: {
    onSearch() {
      this.$refs.updateRequestsTable.currentPage = 1;
      this.$refs.updateRequestsTable.fetchResources();
    },
    displayType(type) {
      switch (type) {
        case "services":
          return "Service";
        case "organisations":
          return "Organisation";
        case "locations":
          return "Location";
        case "service_locations":
          return "Service location";
        case "organisation_sign_up_form":
          return "Organisation sign up form";
        default:
          return "Invalid type";
      }
    }
  }
};
</script>
