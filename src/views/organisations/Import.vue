<template>
    <gov-width-container>
        <vue-headful :title="`${appName} - List Organisations`" />

        <gov-back-link :to="{ name: 'dashboard' }">Back to dashboard</gov-back-link>
        <gov-main-wrapper>
        <gov-grid-row>
            <gov-grid-column width="full">

                <gov-heading size="xl">Bulk upload organisations</gov-heading>
                <gov-body>
                    <p>This tool allows you to upload the details of more than one organisation into the platform. You can add up to 5000 organisations in a single document.</p>

                    <p>The import tool requires all documents to be either in the .xls or .xlsx format. Please note that .csv files are not supported.</p>

                    <p><gov-link :href="exampleSpreadsheetDownloadLink">An example template can be downloaded here</gov-link> for you to populate offline and upload below. The uploaded document must follow this template and new columns can not be added.</p>

                    <p>Upon import, the tool will check the data you have provided to make sure it is valid. If there are any errors with the data, none of the data will be imported and you will be informed of the specific rows and data that are invalid.</p>
                </gov-body>

                <organisations-import-form
                    :errors="form.$errors"
                    :spreadsheet.sync="file"
                    :feedback="formResponse"
                    @clear="resetForm"
                />

                <gov-button v-if="form.$submitting" disabled type="submit">Uploading...</gov-button>
                <gov-button v-else @click="onSubmit" type="submit">Upload</gov-button>
                <ck-submit-error v-if="form.$errors.any()" />
            </gov-grid-column>
            </gov-grid-row>
            <gov-grid-row v-if="invalidRows">
              <gov-grid-column width="full">
                <gov-heading size="m">Invalid rows</gov-heading>
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
                        :key="`OrganisiationImportErrorField-${index}`">{{error.row[index]}}
                        <gov-error-message
                          v-if="error.errors[index]"
                          :for="`OrganisiationImportErrorField-${index}`">{{error.errors[index][0]}}</gov-error-message>
                      </gov-table-cell>
                    </gov-table-row>
                  </template>
                </gov-table>
              </gov-grid-column>
            </gov-grid-row>
        </gov-main-wrapper>
    </gov-width-container>
</template>
<script>
import Form from "@/classes/Form";
import OrganisationsImportForm from "@/views/organisations/forms/OrganisationsImportForm";

export default {
  name: "OrganisationsImport",
  components: {
    Form,
    OrganisationsImportForm
  },

  data() {
    return {
      file: null,

      uploadRows: null,

      invalidRows: null,

      form: new Form({
        spreadsheet: null
      }),

      fields: {
        index: "Index",
        name: "Name",
        description: "Description",
        email: "Email",
        phone: "Phone",
        url: "Url"
      }
    };
  },

  computed: {
    formResponse() {
      return this.uploadRows
        ? "Imported " +
            this.uploadRows +
            (this.uploadRows === 1 ? " Organisation" : "Organisations")
        : null;
    },
    exampleSpreadsheetDownloadLink() {
      return `${
        process.env.VUE_APP_API_URI
      }/downloads/organisations_import_example.xls`;
    }
  },

  methods: {
    resetForm(event) {
      this.uploadRows = null;
      this.form.$errors.clear(event);
      this.invalidRows = null;
    },
    async onSubmit() {
      this.form.spreadsheet = this.file;

      this.form
        .post("/organisations/import")
        .then(response => {
          this.uploadRows = response.data.imported_row_count;
          this.file = null;
        })
        .catch(error => {
          this.invalidRows = error.data.errors.spreadsheet;
          this.file = null;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
