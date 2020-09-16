<template>
  <div>
    <ck-text-input
      :value="name"
      @input="onInput('name', $event)"
      id="name"
      label="Organisation name"
      type="text"
      :error="errors.get('name')"
    />

    <ck-text-input
      :value="slug"
      @input="onInput('slug', $event)"
      id="slug"
      label="Unique slug"
      type="text"
      :error="errors.get('slug')"
    >
      <gov-hint slot="hint" for="slug">
        This will be used to access the organisation page.<br>
        e.g. example.com/organisations/{{ slug }}
      </gov-hint>
    </ck-text-input>

    <ck-wysiwyg-input
      :value="description"
      @input="onInput('description', $event)"
      id="description"
      label="Please provide a one-line summary of organisation"
      hint="This should be a short line or two that summarises who the organisation is and will appear below the Organisation name on it's page."
      :error="errors.get('description')"
    />

    <ck-text-input
      :value="url"
      @input="onInput('url', $event)"
      id="url"
      label="Organisation website address"
      type="url"
      :error="errors.get('url')"
    />

    <ck-text-input
      :value="phone"
      @input="onInput('phone', $event)"
      id="phone"
      label="Public phone"
      type="tel"
      :error="errors.get('phone')"
    />

    <ck-text-input
      :value="email"
      @input="onInput('email', $event)"
      id="email"
      label="Public email address"
      type="email"
      :error="errors.get('email')"
    />

    <gov-heading size="m">Organisation Address</gov-heading>

    <organisation-location-form
      :location_id="location_id"
      @update:location_id="onInput('location_id', $event)"
    />

    <ck-image-input
      @input="onInput('logo_file_id', $event.file_id)"
      id="logo"
      label="Organisation logo"
      accept="image/x-png"
      :existing-url="id ? apiUrl(`/organisations/${id}/logo.png?v=${now}`) : undefined"
    />

    <social-medias-input
      :social-medias="social_medias"
      @input="$emit('update:social_medias', $event)"
      :errors="errors"
    />

  </div>
</template>

<script>
import CkImageInput from "@/components/Ck/CkImageInput";
import SocialMediasInput from "@/views/services/inputs/SocialMediasInput";
import OrganisationLocationForm from "@/views/organisations/forms/OrganisationLocationForm";

export default {
  name: "OrganisationForm",
  components: { CkImageInput, OrganisationLocationForm, SocialMediasInput },
  props: {
    errors: {
      required: true,
      type: Object
    },
    name: {
      required: true,
      type: String
    },
    slug: {
      required: true,
      type: String
    },
    description: {
      required: true,
      type: String
    },
    url: {
      required: false,
      type: String,
      default: ""
    },
    phone: {
      required: false,
      type: String,
      default: ""
    },
    email: {
      required: false,
      type: String,
      default: ""
    },
    id: {
      required: false,
      type: String
    },
    location_id: {
      required: false,
      type: String,
      default: null
    },
    social_medias: {
      required: false,
      type: Array,
      default() {
        return [];
      }
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
