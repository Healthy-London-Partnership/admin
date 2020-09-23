<template>
    <div>
        <ck-radio-input
            :value="location_type"
            @input="location_type = $event"
            id="location_type"
            label="Select location"
            hint="You can select an existing location or create a new one."
            :options="locationTypes"
            :error="null"
        />

        <!-- Existing location: select from list -->
        <gov-inset-text v-if="location_type === 'existing'">
            <ck-loader v-if="loading" />
            <ck-select-input
            v-else
            :value="location_id"
            @input="onInput({ field: 'location_id', value: $event })"
            id="location_id"
            label="Location"
            :options="locations"
            :error="errors.location_id"
            />
        </gov-inset-text>
        <!-- /Existing location: select from list -->

        <!-- New location: enter details -->
        <gov-inset-text v-else-if="location_type === 'new'">
            <location-form
            :errors="locationForm.$errors"
            :address_line_1.sync="locationForm.address_line_1"
            :address_line_2.sync="locationForm.address_line_2"
            :address_line_3.sync="locationForm.address_line_3"
            :city.sync="locationForm.city"
            :county.sync="locationForm.county"
            :postcode.sync="locationForm.postcode"
            :country.sync="locationForm.country"
            :has_induction_loop.sync="locationForm.has_induction_loop"
            :has_wheelchair_access.sync="locationForm.has_wheelchair_access"
            @clear="$emit('clear-location', $event)"
            />
          <gov-button v-if="submitting" disabled type="submit">Creating...</gov-button>
          <gov-button v-else @click="onSubmit" type="submit">Create Location</gov-button>
          <ck-submit-error v-if="locationForm.$errors.any()" />
        </gov-inset-text>
        <!-- /New location: enter details -->
    </div>
</template>

<script>
import Form from "@/classes/Form";
import LocationForm from "@/views/locations/forms/LocationForm";

export default {
  components: {
    LocationForm
  },
  props: {
    location_id: {
      required: false,
      default: null
    }
  },
  data() {
    return {
      errors: {
        location_id: null
      },
      locations: [],
      locationTypes: [
        { value: "existing", label: "Existing" },
        { value: "new", label: "New" }
      ],
      location_type: null,
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
    onInput({ field, value }) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear-location", field);
    },
    async onSubmit() {
      try {
        this.submitting = true;

        // Post the location if new.
        if (this.location_type === "new") {
          const { data: location } = await this.locationForm.post("/locations");
          this.location_type = "existing";
          // Append the new location to the Locations array
          this.appendLocation(location);
          // Update the organisation location ID.
          this.location_id = location.id;
          this.onInput({ field: "location_id", value: this.location_id });
        }
      } catch (error) {
        this.submitting = false;
      }
    },
    onUpdate({ value }) {
      this.$emit("update:location_id", { location_id: value });
    },
    async fetchLocations() {
      this.loading = true;
      this.locations = await this.fetchAll("/locations");
      this.locations = this.locations.map(location => {
        return {
          text: `${location.address_line_1}, ${location.city}, ${
            location.postcode
          }`,
          value: location.id
        };
      });
      this.locations.unshift({
        text: "Please select",
        value: null,
        disabled: true
      });
      this.loading = false;
    },
    appendLocation(location) {
      this.locations.push({
        text: `${location.address_line_1}, ${location.city}, ${
          location.postcode
        }`,
        value: location.id
      });
    }
  },
  created() {
    this.location_type = this.location_id ? "existing" : "";
    this.fetchLocations();
  }
};
</script>

<style lang="scss" scoped>
</style>
