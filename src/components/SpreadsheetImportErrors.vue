<template>
  <div :class="{'responsive-table-wrapper': isWideTable}">
    <gov-heading size="s"><gov-error-message>Invalid rows</gov-error-message></gov-heading>
    <gov-table>
      <template slot="header">
        <gov-table-row>
          <gov-table-header
            v-for="(field, index) in fields"
            :key="`OrganisiationImportErrorHeader-${index}`"
          >
            {{ field }}
          </gov-table-header>
        </gov-table-row>
      </template>
      <template slot="body">
        <gov-table-row v-for="(error, index) in invalidRows" :key="`OrganisiationImportErrorRow-${index}`">
          <gov-table-cell
            v-for="(field, index) in fields"
            :key="`OrganisiationImportErrorField-${index}`">{{trimString(error.row[index])}}
            <gov-error-message
              v-if="error.errors[index]"
              :for="`OrganisiationImportErrorField-${index}`">{{error.errors[index][0]}}</gov-error-message>
          </gov-table-cell>
        </gov-table-row>
      </template>
    </gov-table>
  </div>
</template>

<script>
export default {
  props: {
    fields: {
      type: Array,
      required: true,
    },
    invalidRows: {
      type: Array,
      required: true,
    },
  },
  computed: {
    isWideTable() {
      return Object.keys(this.fields).length > 6;
    },
  },
  methods: {
    trimString(s) {
      return String(s).length > 30 ? String(s).slice(0, 30) + '...' : s;
    },
  },
};
</script>

<style lang="scss" scoped>
.responsive-table-wrapper {
  overflow-x: auto;
}
</style>
