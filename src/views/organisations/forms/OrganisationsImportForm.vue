<template>
  <ck-file-input
    :value="spreadsheet"
    @input="onInput('spreadsheet', $event === null ? null : $event.content)"
    id="organisations"
    label="Upload Organisations Spreadsheet (.xls or .xlsx)"
    accept="*"
    :error="errors.get('invalidRows')"
    :hint="feedback"
  >
  </ck-file-input>
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
    },

    feedback: {
      type: String,
      default: null
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
