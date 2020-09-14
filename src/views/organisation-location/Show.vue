<template>
    <div>
        <organisation-location-form
              :errors="locationForm.$errors"
              :location_type.sync="location_type"
              :location_id.sync="location_id"
              :address_line_1.sync="locationForm.address_line_1"
              :address_line_2.sync="locationForm.address_line_2"
              :address_line_3.sync="locationForm.address_line_3"
              :city.sync="locationForm.city"
              :county.sync="locationForm.county"
              :postcode.sync="locationForm.postcode"
              :country.sync="locationForm.country"
              :has_induction_loop.sync="locationForm.has_induction_loop"
              :has_wheelchair_access.sync="locationForm.has_wheelchair_access"
              @clear="locationForm.$errors.clear($event)"
            />

        <ck-submit-error v-if="locationForm.$errors.any()" />

    </div>
</template>

<script>
import Form from "@/classes/Form";
import http from "@/http";
import OrganisationLocationForm from "@/views/organisation-location/forms/OrganisationLocationForm";

export default {
    components: {
        OrganisationLocationForm
    },
    data() {
    return {
      location_type: null,
      location_id: null,
      locationForm: new Form({
        address_line_1: "",
        address_line_2: "",
        address_line_3: "",
        city: "",
        county: "",
        postcode: "",
        country: "United Kingdom",
        accessibility_info: "",
        has_wheelchair_access: false,
        has_induction_loop: false
      }),
      organisation: null,
      loading: false,
      submitting: false
    };
  },
  methods: {
    async fetchOrganisation() {
      this.loading = true;
      const response = await http.get(
        `/organisations/${this.$route.params.organisation}`
      );
      this.organisation = response.data.data;
      this.locationtype = this.organisation.location? 'existing' : null;
      this.location_id = this.organisation.location? this.organisation.location.id : null;
      this.loading = false;
    },
    async onSubmit() {
      try {
        this.submitting = true;

        // Post the location if new.
        if (this.location_type === "new") {
          const { data: location } = await this.locationForm.post("/locations");
          this.location_type = "existing";
          this.form.location_id = location.id;
        }

        // Post the service location.
        const { data: service } = await this.form.post("/service-locations");
        this.$router.push({
          name: "service-locations-show",
          params: { serviceLocation: service.id }
        });
      } catch (error) {
        this.submitting = false;
      }
    }
  },
  created() {
    this.fetchOrganisation();
  }
}
</script>

<style lang="scss" scoped>

</style>
