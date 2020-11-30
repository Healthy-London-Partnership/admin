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

                  <gov-form-group v-if="auth.isSuperAdmin">
                    <gov-label for="filter[has_admin_invite_status]">Has Admin invite status</gov-label>
                    <gov-select
                      v-model="filters.has_admin_invite_status"
                      id="filter[has_admin_invite_status]"
                      name="filter[has_admin_invite_status]"
                      :options="hasAdminInviteStatusOptions"
                    />
                  </gov-form-group>
                </template>
              </ck-table-filters>
            </gov-grid-column>

            <gov-grid-column v-if="auth.isGlobalAdmin || auth.isLocalAdmin" width="one-third">
              <gov-button @click="onAddOrganisation" type="submit" success expand>Add organisation</gov-button>
              <gov-button v-if="auth.isSuperAdmin" :to="{name: 'organisations-import'}" type="submit" success expand>Bulk import</gov-button>
            </gov-grid-column>
          </gov-grid-row>

          <div v-if="auth.isSuperAdmin || auth.isLocalAdmin" class="text-right">
            <gov-button v-if="auth.isSuperAdmin" @click="onSelectAllInvites" type="button" class="govuk-!-margin-right-2" :disabled="inviting">
              Select/deselect all
            </gov-button>

            <gov-button @click="onInvite" type="button" :disabled="organisationInvites.length === 0 || inviting">
              <template v-if="!inviting">Invite selected</template>
              <template v-else>Inviting selected...</template>
            </gov-button>
            <gov-hint v-show="organisationInviteLimitReached">Invite limit reached</gov-hint>
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
            <template v-if="auth.isSuperAdmin" slot="cell:4" slot-scope="{ resource: organisation }">
              {{ organisation.admin_invite_status | ucFirst }}
            </template>
            <template
              v-if="auth.isSuperAdmin || auth.isLocalAdmin"
              slot="cell:5"
              slot-scope="{ resource: organisation }"
            >
              <gov-checkbox
                @input="onInviteOrganisation(organisation)"
                :value="organisationInviteSelected(organisation.id)"
                :id="`organisation_invite_${organisation.id}`"
                :name="`organisation_invite_${organisation.id}`"
                label=""
                :disabled="!canInvite(organisation)"
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
        has_services: "",
        has_admin_invite_status: ""
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
        { value: "any", text: "Any" },
        { value: "none", text: "None" },
        { value: "facebook", text: "Facebook" },
        { value: "twitter", text: "Twitter" },
        { value: "instagram", text: "Instagram" },
        { value: "youtube", text: "YouTube" },
        { value: "other", text: "Other" }
      ],
      hasPhoneOptions: [
        { value: "", text: "All" },
        { value: "any", text: "Any" },
        { value: "none", text: "None" },
        { value: "landline", text: "Landline" },
        { value: "mobile", text: "Mobile" }
      ],
      hasServicesOptions: [
        { value: "", text: "All" },
        { value: true, text: "Yes" },
        { value: false, text: "No" }
      ],
      hasAdminInviteStatusOptions: [
        { value: "", text: "All" },
        { value: "none", text: "None" },
        { value: "invited", text: "Invited" },
        { value: "pending", text: "Pending" },
        { value: "confirmed", text: "Confirmed" }
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

      if (this.filters.has_admin_invite_status !== "") {
        params[
          "filter[has_admin_invite_status]"
        ] = this.filters.has_admin_invite_status;
      }

      return params;
    },

    columns() {
      if (this.auth.isSuperAdmin || this.auth.isLocalAdmin) {
        return [
          { heading: "Organisation name", sort: "name" },
          { heading: "Web address URL" },
          { heading: "Phone number" },
          { heading: "Email" },
          { heading: "Admin Status" },
          { heading: "Invite" }
        ];
      }

      return [
        { heading: "Organisation name", sort: "name" },
        { heading: "Web address URL" },
        { heading: "Phone number" },
        { heading: "Email" }
      ];
    },
    organisationInviteLimitReached() {
      return this.organisationInvites.length === 1 && this.auth.isLocalAdmin
        ? true
        : false;
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
    onInviteOrganisation(organisation) {
      if (this.organisationInviteSelected(organisation.id)) {
        this.organisationInvites.splice(
          this.organisationInvites.findIndex(oi => {
            oi.organisation_id === organisation.id;
          }),
          1
        );
        return;
      }

      this.organisationInvites.push({
        organisation_id: organisation.id,
        use_email: organisation.email !== null
      });
    },
    organisationInviteSelected(organisationId) {
      return this.organisationInvites.find(oi => {
        oi.organisation_id === organisationId;
      });
    },
    onSelectAllInvites() {
      if (
        this.organisationInvites.length ===
        this.$refs.organisationsTable.resources.filter(this.canInvite).length
      ) {
        this.organisationInvites.splice(0, this.organisationInvites.length);
        return;
      }

      this.organisationInvites.splice(0, this.organisationInvites.length);

      this.$refs.organisationsTable.resources
        .filter(this.canInvite)
        .forEach(organisation =>
          this.organisationInvites.push({
            organisation_id: organisation.id,
            use_email: organisation.email !== null
          })
        );
    },
    async onInvite() {
      this.inviting = true;

      await http.post("/organisation-admin-invites", {
        organisations: this.organisationInvites
      });

      this.$refs.organisationsTable.fetchResources();

      window.alert(
        "The organisations will have invitation emails sent out shortly."
      );

      this.inviting = false;
    },
    onFetch() {
      this.organisationInvites.splice(0, this.organisationInvites.length);
    },
    canInvite(organisation) {
      if (
        !this.inviting &&
        (organisation.email !== null || organisation.phone.startsWith("07")) &&
        organisation.admin_invite_status === "none"
      ) {
        return this.organisationInviteLimitReached
          ? this.organisationInviteSelected(organisation.id)
          : true;
      }
      return false;
    }
  },
  filters: {
    ucFirst: function(s) {
      return typeof s === "string"
        ? s.charAt(0).toUpperCase() + s.slice(1)
        : "";
    }
  }
};
</script>
