<template>
  <div>
    <ck-select-input
      v-if="!loading"
      :value="organisationId"
      :label="label"
      :error="null"
      :options="organisationOptions"
      id="adminOrganisationSelect"
      @input="$emit('change', $event)"
    />
  </div>
</template>

<script>
import http from "@/http";

export default {
  model: {
    prop: "organisationId",
    event: "change"
  },
  props: {
    filter: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: "Select Organisation"
    },
    organisationId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      organisations: [],
      loading: false
    };
  },
  computed: {
    organisationsFilter() {
      return this.filter ? `?filter[${this.filter}]=true'` : "";
    },
    organisationOptions() {
      const orgs = this.organisations.map(o => {
        return {
          value: o.id,
          text: o.name,
          disabled: false
        };
      });
      orgs.splice(0, 0, {
        value: "",
        text: "Please Select",
        disabled: true
      });
      return orgs;
    }
  },
  methods: {
    async fetchOrganisations() {
      this.loading = true;

      const response = await http.get(
        `/organisations${this.organisationsFilter}`
      );
      this.loading = false;
      this.organisations = response.data.data;
    }
  },
  created() {
    this.fetchOrganisations();
  }
};
</script>

<style lang="scss" scoped>
</style>
