<template>
    <div>
        <ck-radio-input
            :value="location_type"
            @input="onInput({ field: 'location_type', value: $event })"
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
            :error="errors.get('location_id')"
            />
        </gov-inset-text>
        <!-- /Existing location: select from list -->

        <!-- New location: enter details -->
        <gov-inset-text v-else-if="location_type === 'new'">
            <location-form
            :errors="errors"
            :address_line_1="address_line_1"
            :address_line_2="address_line_2"
            :address_line_3="address_line_3"
            :city="city"
            :county="county"
            :postcode="postcode"
            :country="country"
            :has_induction_loop="has_induction_loop"
            :has_wheelchair_access="has_wheelchair_access"
            @update:address_line_1="onInput({ field: 'address_line_1', value: $event })"
            @update:address_line_2="onInput({ field: 'address_line_2', value: $event })"
            @update:address_line_3="onInput({ field: 'address_line_3', value: $event })"
            @update:city="onInput({ field: 'city', value: $event })"
            @update:county="onInput({ field: 'county', value: $event })"
            @update:postcode="onInput({ field: 'postcode', value: $event })"
            @update:country="onInput({ field: 'country', value: $event })"
            @update:has_induction_loop="onInput({ field: 'has_induction_loop', value: $event })"
            @update:has_wheelchair_access="onInput({ field: 'has_wheelchair_access', value: $event })"
            @clear="$emit('clear-location', $event)"
            />
        </gov-inset-text>
        <!-- /New location: enter details -->
    </div>
</template>

<script>
import LocationForm from '@/views/locations/forms/LocationForm';

export default {
  components: {
    LocationForm,
  },
  props: {
    errors: {
      required: true,
      type: Object,
    },
    location_type: {
      required: false,
      type: String,
      default: ''
    },
    location_id: {
      required: false,
    },
    address_line_1: {
      required: false,
      type: String,
      default: ''
    },
    address_line_2: {
      required: false,
      type: String,
      default: ''
    },
    address_line_3: {
      required: false,
      type: String,
      default: ''
    },
    city: {
      required: false,
      type: String,
      default: ''
    },
    county: {
      required: false,
      type: String,
      default: ''
    },
    postcode: {
      required: false,
      type: String,
      default: ''
    },
    country: {
      required: false,
      type: String,
      default: ''
    },
    has_induction_loop: {
      required: false,
      type: Boolean,
    },
    has_wheelchair_access: {
      required: false,
      type: Boolean,
    },
  },
  data() {
    return {
      loading: false,
      locations: [],
      locationTypes: [
        { value: "existing", label: "Existing" },
        { value: "new", label: "New" }
      ],
    };
  },
  methods: {
    onInput({ field, value }) {
      this.$emit(`update:${field}`, value);
      this.$emit('clear-location', field);
    },
    async fetchLocations() {
      this.loading = true;
      this.locations = await this.fetchAll('/locations');
      this.locations = this.locations.map((location) => {
        return {
          text: `${location.address_line_1}, ${location.city}, ${
            location.postcode
          }`,
          value: location.id,
        };
      });
      this.locations.unshift({
        text: 'Please select',
        value: null,
        disabled: true,
      });
      this.loading = false;
    },
    appendLocation(location) {
      this.locations.push({
        text: `${location.address_line_1}, ${location.city}, ${
          location.postcode
        }`,
        value: location.id,
      });
    },
  },
  created() {
    this.fetchLocations();
    this.$root.$on('location-created', this.appendLocation);
  },
};
</script>

<style lang="scss" scoped>
</style>
