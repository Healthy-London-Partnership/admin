<template>
  <div>
    <gov-heading size="l">Details</gov-heading>
    <gov-table>
      <template slot="body">
        <gov-table-row>
          <gov-table-header top scope="row">Name of service</gov-table-header>
          <gov-table-cell>{{ service.name }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row">Service website address</gov-table-header>
          <gov-table-cell>{{ service.url }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row">Service logo</gov-table-header>
          <gov-table-cell>
            <img :src="apiUrl(`/services/${service.id}/logo.png?v=${service.updated_at}`)" alt="Service logo" class="ck-logo">
          </gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row">Summary of service</gov-table-header>
          <gov-table-cell>{{ service.intro }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row">Service description</gov-table-header>
          <gov-table-cell v-html="toHtml(service.description)" />
        </gov-table-row>
      </template>
    </gov-table>
  </div>
</template>

<script>
export default {
  name: "DetailsTab",
  props: {
    service: {
      type: Object,
      required: true
    }
  }
};
</script>