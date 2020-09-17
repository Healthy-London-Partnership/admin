<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - List Organisations`" />

    <gov-back-link :to="{ name: 'dashboard' }">Back to dashboard</gov-back-link>
    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">

          <gov-heading size="xl">Organisations</gov-heading>

          <gov-grid-row>
            <gov-grid-column width="two-thirds">
              <ck-table-filters @search="onSearch" hide-extra>
                <gov-form-group>
                  <gov-label for="filter[name]">Organisation name</gov-label>
                  <gov-input v-model="filters.name" id="filter[name]" name="filter[name]" type="search"/>
                </gov-form-group>
              </ck-table-filters>
            </gov-grid-column>
            <gov-grid-column v-if="auth.isGlobalAdmin" width="one-third">
              <gov-button @click="onAddOrganisation" type="submit" success expand>Add organisation</gov-button>
            </gov-grid-column>
          </gov-grid-row>

          <div class="text-right">
            <gov-button @click="onSelectAllInvites" type="button" class="govuk-!-margin-right-2">
              Select/deselect all
            </gov-button>

            <gov-button @click="onInvite" type="button" :disabled="organisationInvites.length === 0">
              Invite selected
            </gov-button>
          </div>

          <ck-resource-listing-table
            ref="organisationsTable"
            uri="/organisations"
            :params="params"
            default-sort="name"
            :columns="[
              { heading: 'Organisation name', sort: 'name' },
              { heading: 'Web address URL' },
              { heading: 'Phone number' },
              { heading: 'Email' },
              { heading: 'Invite' },
            ]"
            :view-route="(organisation) => {
              return {
                name: 'organisations-show',
                params: { organisation: organisation.id }
              }
            }"
          >
            <template slot="cell:0" slot-scope="{ resource: organisation }">
              {{ organisation.name }}
            </template>
            <template slot="cell:1" slot-scope="{ resource: organisation }">
              {{ organisation.url }}
            </template>
            <template slot="cell:2" slot-scope="{ resource: organisation }">
              {{ organisation.phone || '-' }}
            </template>
            <template slot="cell:3" slot-scope="{ resource: organisation }">
              {{ organisation.email || '-' }}
            </template>
            <template slot="cell:4" slot-scope="{ resource: organisation }">
              <gov-checkbox
                @input="onInviteOrganisation(organisation.id)"
                :value="organisationInviteSelected(organisation.id)"
                :id="`organisation_invite_${organisation.id}`"
                :name="`organisation_invite_${organisation.id}`"
                label=""
                :disabled="organisation.email === null"
              />
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
import http from "@/http";

export default {
  name: "ListOrganisations",
  components: { CkResourceListingTable, CkTableFilters },
  data() {
    return {
      filters: {
        name: ""
      },
      organisationInvites: [],
      inviting: false
    };
  },
  computed: {
    params() {
      const params = {
        "filter[has_permission]": true
      };

      if (this.filters.name !== "") {
        params["filter[name]"] = this.filters.name;
      }

      return params;
    }
  },
  methods: {
    onSearch() {
      this.$refs.organisationsTable.currentPage = 1;
      this.$refs.organisationsTable.fetchResources();
    },
    onAddOrganisation() {
      this.$router.push({ name: "organisations-create" });
    },
    onInviteOrganisation(organisationId) {
      if (this.organisationInviteSelected(organisationId)) {
        this.organisationInvites.splice(this.organisationInvites.indexOf(organisationId), 1);
        return;
      }

      this.organisationInvites.push(organisationId);
    },
    organisationInviteSelected(organisationId) {
      return this.organisationInvites.includes(organisationId);
    },
    onSelectAllInvites() {
      if (
          this.organisationInvites.length === this.$refs.organisationsTable.resources
            .filter(organisation => organisation.email !== null).length
        ) {
        this.organisationInvites.splice(0, this.organisationInvites.length);
        return;
      }

      this.organisationInvites.splice(0, this.organisationInvites.length);

      this.$refs.organisationsTable.resources
        .filter(organisation => organisation.email !== null)
        .forEach(organisation => this.organisationInvites.push(organisation.id))
    },
    async onInvite() {
      this.inviting = true

      await http.post("/organisation-admin-invites", {
        organisations: this.organisationInvites.map(organisationId => {
          return {
            organisation_id: organisationId,
            use_email: true
          }
        })
      })

      this.inviting = false
    }
  }
};
</script>
