<template>
  <gov-table>
    <template slot="body">
      <gov-table-row>
        <gov-table-header top scope="row">Organisation name</gov-table-header>
        <gov-table-cell>{{ organisation.name }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Description</gov-table-header>
        <gov-table-cell v-html="toHtml(organisation.description)" />
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Website Address</gov-table-header>
        <gov-table-cell break>{{ organisation.url }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Phone number</gov-table-header>
        <gov-table-cell>{{ organisation.phone || '-' }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Email</gov-table-header>
        <gov-table-cell>{{ organisation.email || '-' }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Logo</gov-table-header>
        <gov-table-cell>
          <img :src="apiUrl(`/organisations/${organisation.id}/logo.png?v=${organisation.updated_at}`)" alt="Organisation logo" class="ck-logo">
        </gov-table-cell>
      </gov-table-row>
      <gov-table-row v-if="auth.isSuperAdmin">
        <gov-table-header top scope="row">Organisation admin invite URL</gov-table-header>
        <gov-table-cell>
          <gov-link :to="inviteUrl" v-if="inviteUrl">{{ inviteUrl }}</gov-link>
          <template v-else-if="generatingInviteUrl">Generating URL...</template>
          <gov-link v-else @click="onGenerateInviteUrl">Generate URL</gov-link>
        </gov-table-cell>
      </gov-table-row>
    </template>
  </gov-table>
</template>

<script>
import http from "@/http";

export default {
  name: "CkOrganisationDetails",
  props: {
    organisation: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      inviteUrl: null,
      generatingInviteUrl: false
    }
  },
  methods: {
    async onGenerateInviteUrl() {
      this.generatingInviteUrl = true;

      const { data: { data } } = await http.post("/organisation-admin-invites", {
        organisations: [
          {
            organisation_id: this.organisation.id,
            use_email: false
          }
        ]
      });

      // TODO:https://stackoverflow.com/a/49808270/5745438
      this.inviteUrl = `/organisation-admin-invites/${data[0].id}`;

      this.generatingInviteUrl = false;
    }
  }
};
</script>
