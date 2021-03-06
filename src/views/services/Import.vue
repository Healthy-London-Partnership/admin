<template>
    <gov-width-container>
        <vue-headful :title="`${appName} - Import Support listings`" />

        <gov-back-link :to="{ name: 'dashboard' }">Back to dashboard</gov-back-link>
        <gov-main-wrapper>
        <gov-grid-row>
            <gov-grid-column width="full">

                <gov-heading size="xl">Bulk upload support listings</gov-heading>
                <gov-body>
                    <p>This tool allows you to upload the details of more than one support listing into the platform. You can add up to 5000 support listings in a single document.</p>

                    <p>The import tool requires all documents to be either in the .xls or .xlsx format. Please note that .csv files are not supported.</p>

                    <p><gov-link :href="exampleSpreadsheetDownloadLink">An example template can be downloaded here</gov-link> for you to populate offline and upload below. The uploaded document must follow this template and new columns can not be added.</p>

                    <p>Upon import, the tool will check the data you have provided to make sure it is valid. If there are any errors with the data, none of the data will be imported and you will be informed of the specific rows and data that are invalid.</p>
                </gov-body>

                <organisation-select-form
                  filter="is_admin"
                  label="Select the Organisation to assign the Support listings to"
                  v-model="organisationId"
                />

                <spreadsheet-import-form
                    :errors="form.$errors"
                    :spreadsheet.sync="file"
                    :feedback="formResponse"
                    @clear="resetForm"
                />

                <gov-button v-if="form.$submitting" disabled type="submit">Uploading...</gov-button>
                <gov-button v-else @click="onSubmit" type="submit">Upload</gov-button>
                <ck-loader v-if="form.$submitting">Please wait, this may take up to 5 minutes. Do not navigate away or refresh the page</ck-loader>
                <ck-submit-error v-if="form.$errors.any()" />
            </gov-grid-column>
            </gov-grid-row>
            <gov-grid-row v-if="invalidRows">
              <gov-grid-column width="full">
                <spreadsheet-import-errors
                  :fields="fields"
                  :invalidRows="invalidRows"
                />
              </gov-grid-column>
            </gov-grid-row>
        </gov-main-wrapper>
    </gov-width-container>
</template>
<script>
import Form from "@/classes/Form";
import OrganisationSelectForm from "@/views/organisations/forms/OrganisationSelectForm";
import SpreadsheetImportForm from "@/components/SpreadsheetImportForm";
import SpreadsheetImportErrors from "@/components/SpreadsheetImportErrors";

export default {
  name: "OrganisationsImport",
  components: {
    Form,
    OrganisationSelectForm,
    SpreadsheetImportForm,
    SpreadsheetImportErrors
  },

  data() {
    return {
      file: null,

      organisationId: null,

      uploadRows: null,

      invalidRows: null,

      form: new Form({
        spreadsheet: null,
        organisation_id: null
      }),

      fields: {
        index: "Index",
        name: "Name",
        type: "Type",
        status: "Status",
        is_national: "Is National",
        intro: "Introduction",
        description: "Description",
        wait_time: "Wait Time",
        is_free: "Is Free",
        fees_text: "Fees Text",
        fees_url: "Fees URL",
        testimonial: "Testimonial",
        video_embed: "Video Embed",
        url: "Url",
        contact_name: "Contact Name",
        contact_phone: "Contact Phone",
        contact_email: "Contact Email",
        show_referral_disclaimer: "Show Referral Disclaimer",
        referral_method: "Referral Method",
        referral_button_text: "Referral Button Text",
        referral_email: "Referral Email",
        referral_url: "Referral Url",
        criteria_age_group: "Age Group",
        criteria_disability: "Disability",
        criteria_employment: "Employment",
        criteria_gender: "Gender",
        criteria_housing: "Housing",
        criteria_income: "Income",
        criteria_language: "Language",
        criteria_other: "Other"
      }
    };
  },

  computed: {
    formResponse() {
      return this.uploadRows
        ? "Imported " +
            this.uploadRows +
            (this.uploadRows === 1 ? " Support listing" : " Support listings")
        : null;
    },
    exampleSpreadsheetDownloadLink() {
      return `${
        process.env.VUE_APP_API_URI
      }/downloads/services_import_example.xls`;
    }
  },

  methods: {
    resetForm(event) {
      this.uploadRows = null;
      this.form.$errors.clear(event);
      this.invalidRows = null;
    },
    onSubmit() {
      this.form.spreadsheet = this.file;
      this.form.organisation_id = this.organisationId;

      this.form
        .post("/services/import")
        .then(response => {
          this.uploadRows = response.data.imported_row_count;
          this.file = null;
          this.organisationId = null;
        })
        .catch(error => {
          if (error.data) {
            this.invalidRows = error.data.errors.spreadsheet;
            this.file = null;
          } else if (error.request) {
            console.error(error.request);
          } else {
            console.error(error.message);
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
