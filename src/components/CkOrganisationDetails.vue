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

      <gov-table-row>
        <gov-table-header scope="row" top>Social links</gov-table-header>
        <gov-table-cell break>
          <gov-list>
            <li v-for="(socialMedia, index) in organisation.social_medias" :key="index">
              ({{ humanReadableSocialMedia(socialMedia.type) }}) {{ socialMedia.url }}
            </li>
            <li v-if="organisation.social_medias.length === 0">-</li>
          </gov-list>
        </gov-table-cell>
      </gov-table-row>

      <gov-table-row>
        <gov-table-header scope="row">Location</gov-table-header>
        <gov-table-cell v-if="organisation.location">
          {{addressString}} <gov-link :to="{ name: 'locations-show', params: { location: organisation.location.id } }">View</gov-link>
        </gov-table-cell>
        <gov-table-cell v-else>No locations for this organisation</gov-table-cell>
      </gov-table-row>

      <gov-table-row v-if="auth.isSuperAdmin">
        <gov-table-header top scope="row">Organisation admin invite URL</gov-table-header>
        <gov-table-cell>
          <gov-link :to="inviteUrl.relative" v-if="inviteUrl">{{ inviteUrl.absolute }}</gov-link>
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
    };
  },

  methods: {
    async onGenerateInviteUrl() {
      this.generatingInviteUrl = true;

      const {
        data: { data }
      } = await http.post("/organisation-admin-invites", {
        organisations: [
          {
            organisation_id: this.organisation.id,
            use_email: false
          }
        ]
      });

      console.log();
      this.inviteUrl = {
        relative: `/organisation-admin-invites/${data[0].id}`,
        absolute: `${window.location.protocol}//${
          window.location.host
        }/organisation-admin-invites/${data[0].id}`
      };

      this.generatingInviteUrl = false;
    },

    humanReadableSocialMedia(type) {
      switch (type) {
        case "twitter":
          return "Twitter";
        case "facebook":
          return "Facebook";
        case "instagram":
          return "Instagram";
        case "youtube":
          return "YouTube";
        case "other":
          return "Other";
      }
    }
  },

  computed: {
    addressString() {
      return [
        this.organisation.location.address_line_1,
        this.organisation.location.city,
        this.organisation.location.postcode
      ].join(", ");
    }
  }
};
</script>
