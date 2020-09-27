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
              <ck-table-filters @search="onSearch">
                <gov-form-group>
                  <gov-label for="filter[name]">Organisation name</gov-label>
                  <gov-input v-model="filters.name" id="filter[name]" name="filter[name]" type="search"/>
                </gov-form-group>

                <template slot="extra-filters">
                  <gov-form-group>
                    <gov-label for="filter[has_email]">Has email</gov-label>
                    <gov-select
                      v-model="filters.has_email"
                      id="filter[has_email]"
                      name="filter[has_email]"
                      :options="hasEmailOptions"
                    />
                  </gov-form-group>

                  <gov-form-group>
                    <gov-label for="filter[has_social_medias]">
                      Has social medias
                    </gov-label>
                    <gov-select
                      v-model="filters.has_social_medias"
                      id="filter[has_social_medias]"
                      name="filter[has_social_medias]"
                      :options="hasSocialMediasOptions"
                    />
                  </gov-form-group>

                  <gov-form-group>
                    <gov-label for="filter[has_phone]">Has phone</gov-label>
                    <gov-select
                      v-model="filters.has_phone"
                      id="filter[has_phone]"
                      name="filter[has_phone]"
                      :options="hasPhoneOptions"
                    />
                  </gov-form-group>

                  <gov-form-group>
                    <gov-label for="filter[has_services]">Has services</gov-label>
                    <gov-select
                      v-model="filters.has_services"
                      id="filter[has_services]"
                      name="filter[has_services]"
                      :options="hasServicesOptions"
                    />
                  </gov-form-group>
                </template>
              </ck-table-filters>
            </gov-grid-column>

            <gov-grid-column v-if="auth.isGlobalAdmin" width="one-third">
              <gov-button @click="onAddOrganisation" type="submit" success expand>Add organisation</gov-button>
              <gov-button v-if="auth.isSuperAdmin" :to="{name: 'organisations-import'}" type="submit" success expand>Bulk import</gov-button>
            </gov-grid-column>
          </gov-grid-row>

          <div v-if="auth.isSuperAdmin" class="text-right">
            <gov-button @click="onSelectAllInvites" type="button" class="govuk-!-margin-right-2" :disabled="inviting">
              Select/deselect all
            </gov-button>

            <gov-button @click="onInvite" type="button" :disabled="organisationInvites.length === 0 || inviting">
              <template v-if="!inviting">Invite selected</template>
              <template v-else>Inviting selected...</template>
            </gov-button>
          </div>

          <ck-resource-listing-table
            @fetch="onFetch"
            ref="organisationsTable"
            uri="/organisations"
            :params="params"
            default-sort="name"
            :columns="columns"
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
            <template
              v-if="auth.isSuperAdmin"
              slot="cell:4"
              slot-scope="{ resource: organisation }"
            >
              <gov-checkbox
                @input="onInviteOrganisation(organisation.id)"
                :value="organisationInviteSelected(organisation.id)"
                :id="`organisation_invite_${organisation.id}`"
                :name="`organisation_invite_${organisation.id}`"
                label=""
                :disabled="organisation.email === null || inviting"
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
        name: "",
        has_email: "",
        has_social_medias: "",
        has_phone: "",
        has_services: ""
      },
      organisationInvites: [],
      inviting: false,
      hasEmailOptions: [
        { value: "", text: "All" },
        { value: true, text: "Yes" },
        { value: false, text: "No" }
      ],
      hasSocialMediasOptions: [
        { value: "", text: "All" },
        { value: true, text: "Yes" },
        { value: false, text: "No" }
      ],
      hasPhoneOptions: [
        { value: "", text: "All" },
        { value: true, text: "Yes" },
        { value: false, text: "No" }
      ],
      hasServicesOptions: [
        { value: "", text: "All" },
        { value: true, text: "Yes" },
        { value: false, text: "No" }
      ]
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

      if (this.filters.has_email !== "") {
        params["filter[has_email]"] = this.filters.has_email;
      }

      if (this.filters.has_social_medias !== "") {
        params["filter[has_social_medias]"] = this.filters.has_social_medias;
      }

      if (this.filters.has_phone !== "") {
        params["filter[has_phone]"] = this.filters.has_phone;
      }

      if (this.filters.has_services !== "") {
        params["filter[has_services]"] = this.filters.has_services;
      }

      return params;
    },

    columns() {
      if (this.auth.isSuperAdmin) {
        return [
          { heading: "Organisation name", sort: "name" },
          { heading: "Web address URL" },
          { heading: "Phone number" },
          { heading: "Email" },
          { heading: "Invite" }
        ];
      }

      return [
        { heading: "Organisation name", sort: "name" },
        { heading: "Web address URL" },
        { heading: "Phone number" },
        { heading: "Email" }
      ];
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
        this.organisationInvites.splice(
          this.organisationInvites.indexOf(organisationId),
          1
        );
        return;
      }

      this.organisationInvites.push(organisationId);
    },
    organisationInviteSelected(organisationId) {
      return this.organisationInvites.includes(organisationId);
    },
    onSelectAllInvites() {
      if (
        this.organisationInvites.length ===
        this.$refs.organisationsTable.resources.filter(
          organisation => organisation.email !== null
        ).length
      ) {
        this.organisationInvites.splice(0, this.organisationInvites.length);
        return;
      }

      this.organisationInvites.splice(0, this.organisationInvites.length);

      this.$refs.organisationsTable.resources
        .filter(organisation => organisation.email !== null)
        .forEach(organisation =>
          this.organisationInvites.push(organisation.id)
        );
    },
    async onInvite() {
      this.inviting = true;

      await http.post("/organisation-admin-invites", {
        organisations: this.organisationInvites.map(organisationId => {
          return {
            organisation_id: organisationId,
            use_email: true
          };
        })
      });

      window.alert(
        "The organisations will have invitation emails sent out shortly."
      );

      this.inviting = false;
    },
    onFetch() {
      this.organisationInvites.splice(0, this.organisationInvites.length);
    }
  }
};
</script>
