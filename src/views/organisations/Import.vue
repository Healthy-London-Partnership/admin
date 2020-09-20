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

                    <p>An example template can be downloaded here for you to populate offline and upload below. The uploaded document must follow this template and new columns can not be added.</p>

                    <p>Upon import, the tool will check the data you have provided to make sure it is valid. If there are any errors with the data, none of the data will be imported and you will be informed of the specific rows and data that are invalid.</p>
                </gov-body>

                <organisations-import-form
                    :errors="form.$errors"
                    :spreadsheet.sync="file"
                    @clear="form.$errors.clear($event)"
                />

                <gov-button v-if="form.$submitting" disabled type="submit">Uploading...</gov-button>
                <gov-button v-else @click="onSubmit" type="submit">Upload</gov-button>
                <ck-submit-error v-if="form.$errors.any()" />
            </gov-grid-column>
            </gov-grid-row>
        </gov-main-wrapper>
    </gov-width-container>
</template>
<script>
import Form from "@/classes/Form";
import OrganisationsImportForm from '@/views/organisations/forms/OrganisationsImportForm';

export default {
    components: {
        Form, OrganisationsImportForm
    },

    data() {
    return {
      file: null,

      form: new Form({
        spreadsheet: null
      })
    };
  },

    methods: {
        async onSubmit() {

      this.form.spreadsheet = this.file;

      await this.form.post("/organisations/import");

    //   this.$router.push({ name: "organisations-index" });
    },
    }
}
</script>

<style lang="scss" scoped>

</style>
