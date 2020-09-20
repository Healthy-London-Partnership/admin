<template>
  <ck-file-input
    :value="spreadsheet"
    @input="onInput('organisations', $event === null ? null : $event.content)"
    id="organisations"
    label="Upload Organisations Spreadsheet (.xls or .xlsx)"
    accept="*"
    :error="errors.get('invalidRows')"
  />
</template>

<script>
export default {
  name: "OrganisationsImportForm",

  props: {
    errors: {
      required: true,
      type: Object
    },

    spreadsheet: {
      required: true
    }
  },

  methods: {
    onInput(field, value) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear", field);
    }
  }
};
</script>
