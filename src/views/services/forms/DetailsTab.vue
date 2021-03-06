<template>
  <div>
    <gov-heading size="l">Step 3: add a Support listing</gov-heading>
    <gov-grid-row>
      <gov-grid-column width="one-half">

        <gov-body>
          You can create a listing for different types of support including: apps / digital, services, information (e.g. videos), groups, clubs, activities, help lines and advice
        </gov-body>
        <gov-body>You can then select a more specific description of your support offer.</gov-body>

        <gov-section-break size="l" />

        <ck-select-input
          :value="type"
          @input="$emit('update:type', $event); $emit('clear', 'type')"
          id="type"
          label="Type of support"
          hint="Choose one type of support"
          :options="typeOptions"
          :error="errors.get('type')"
        />

        <ck-text-input
          :value="name"
          @input="onNameInput($event)"
          id="name"
          :label="`What is the name of your ${type}? (required)`"
          type="text"
          :error="errors.get('name')"
          placeholder="Dare2Care"
        />

        <ck-text-input
          :value="slug"
          @input="$emit('update:slug', $event); $emit('clear', 'slug')"
          id="slug"
          label="Unique slug"
          type="text"
          :error="errors.get('slug')"
          v-if="auth.isGlobalAdmin"
        >
          <gov-hint slot="hint" for="slug">
            This will be used to access the {{ type }} page.<br>
            e.g. example.com/services/{{ slug }}
          </gov-hint>
        </ck-text-input>

        <template v-if="isNew || auth.isGlobalAdmin">
          <ck-loader v-if="loading" />
          <ck-select-input
            v-else
            :value="organisation_id"
            @input="$emit('update:organisation_id', $event); $emit('clear', 'organisation_id')"
            id="organisation_id"
            label="Organisation"
            :hint="`Which organisation hosts this ${type}?`"
            :options="organisations"
            :error="errors.get('organisation_id')"
          />
        </template>

        <ck-text-input
          :value="url"
          @input="$emit('update:url', $event); $emit('clear', 'url')"
          id="url"
          :label="`What is the web address of your ${type}? (optional)`"
          :hint="`This must start with ‘http://’ or ‘https://’. You can use your organisation’s website address if the ${type} doesn’t have its own.`"
          type="url"
          :error="errors.get('url')"
        />

        <ck-text-input
          :disabled="type !== 'app'"
          :value="ios_app_url"
          @input="$emit('update:ios_app_url', $event); $emit('clear', 'ios_app_url')"
          id="ios_app_url"
          :label="`What is the iOS App Store address of your App?`"
          type="url"
          :error="errors.get('ios_app_url')"
        >
          <template slot="hint">
            <gov-hint for="ios_app_url">
              See <gov-link :href="androidAppStoreHelpUrl" :external="true"> help creating Apple App Store links</gov-link>.
            </gov-hint>
          </template>
        </ck-text-input>

        <ck-text-input
          :disabled="type !== 'app'"
          :value="android_app_url"
          @input="$emit('update:android_app_url', $event); $emit('clear', 'android_app_url')"
          id="android_app_url"
          :label="'What is the Android App Store address of your App?'"
          type="url"
          :error="errors.get('android_app_url')"
        >
          <template slot="hint">
            <gov-hint for="android_app_url">
              See <gov-link :href="androidAppStoreHelpUrl" :external="true"> help on creating Google Play Store links</gov-link>.
            </gov-hint>
          </template>
        </ck-text-input>

        <ck-image-input
          @input="$emit('update:logo_file_id', $event.file_id); $emit('update:logo', $event.image);"
          id="logo"
          :label="`Upload your ${type} logo`"
          accept="image/x-png"
          :existing-url="id ? apiUrl(`/services/${id}/logo.png?v=${now}`) : undefined"
        >
          <template slot="hint">
            <gov-hint for="logo">
              This can be different to the logo of your organisation.
              <gov-link :href="logoHelpHref">Need help with your logo?</gov-link>
            </gov-hint>
            <gov-hint for="logo">
              If your {{ type }} doesn't have a logo, the site will use the
              organisation logo if there is one uploaded.
            </gov-hint>
          </template>
        </ck-image-input>

        <ck-radio-input
          :value="is_national"
          @input="$emit('update:is_national', $event); $emit('clear', 'is_national')"
          id="is_national"
          label="National?"
          hint="Details if the support listing is only available at specific locations or can be accessed nationwide, e.g. via web or phone."
          :options="isNationalOptions"
          :error="errors.get('is_national')"
        />

        <ck-select-input
          :value="score"
          @input="$emit('update:score', $event); $emit('clear', 'score')"
          id="score"
          label="Quality Score"
          :hint="`Rate the overall effectiveness and quality of the ${type} between 1 (poor) and 5 (excellent). This is not displayed but affects positioning within search results.`"
          :options="scoreOptions"
          :error="errors.get('score')"
          v-if="auth.isSuperAdmin"
        />

        <ck-radio-input
          :value="status"
          @input="$emit('update:status', $event); $emit('clear', 'status')"
          id="status"
          :label="`Is the ${type} enabled`"
          :hint="`Indicates if the ${type} is enabled or disabled (disabled ${$options.filters.plural(type)} will not be shown in search results)`"
          :options="statusOptions"
          :error="errors.get('status')"
          v-if="auth.isGlobalAdmin"
        />

        <gov-heading size="m">Gallery items</gov-heading>

        <gov-body>
          Upload images of the {{ type }} to the {{ type }}'s gallery.
        </gov-body>

        <ck-gallery-items-input
          :gallery-items="gallery_items"
          @input="$emit('update:gallery_items', $event)"
          @clear="$emit('clear', $event)"
          :errors="errors"
        />

        <slot />

      </gov-grid-column>
    </gov-grid-row>
  </div>
</template>

<script>
import CkImageInput from "@/components/Ck/CkImageInput";
import CkGalleryItemsInput from "@/views/services/inputs/GalleryItemsInput";

export default {
  name: "DetailsTab",
  components: { CkImageInput, CkGalleryItemsInput },
  props: {
    errors: {
      required: true
    },
    isNew: {
      required: false,
      type: Boolean,
      default: false
    },
    name: {
      required: true
    },
    slug: {
      required: true
    },
    type: {
      required: true
    },
    organisation_id: {
      required: false
    },
    url: {
      required: true
    },
    ios_app_url: {
      type: String,
      default: ""
    },
    android_app_url: {
      type: String,
      default: ""
    },
    is_national: {
      required: true
    },
    score: {
      required: true
    },
    status: {
      required: true
    },
    gallery_items: {
      required: true
    },
    id: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      organisations: [{ text: "Please select", value: null, disabled: true }],
      loading: false,
      typeOptions: [
        { text: "It is a Service", value: "service" },
        { text: "It is an Activity", value: "activity" },
        { text: "It is a Club", value: "club" },
        { text: "It is a Group", value: "group" },
        { text: "It is a Helpline", value: "helpline" },
        { text: "It is an Information", value: "information" },
        { text: "It is an App", value: "app" },
        { text: "It is an Advice", value: "advice" }
      ],
      statusOptions: [
        { label: "Enabled", value: "active" },
        { label: "Disabled", value: "inactive" }
      ],
      iosAppStoreHelpUrl:
        "https://developer.apple.com/library/archive/qa/qa1633/_index.html",
      androidAppStoreHelpUrl:
        "https://support.google.com/admob/answer/3086746?hl=en",
      scoreOptions: [
        { text: "Unrated", value: "" },
        { text: "Poor", value: 1 },
        { text: "Below Average", value: 2 },
        { text: "Average", value: 3 },
        { text: "Above Average", value: 4 },
        { text: "Excellent", value: 5 }
      ]
    };
  },
  computed: {
    logoHelpHref() {
      const to = this.contactEmail;
      const subject = "Help uploading support listing logo";

      return `mailto:${to}?subject=${encodeURIComponent(subject)}`;
    },
    isNationalOptions() {
      return [
        { value: true, label: `Yes - The ${this.type} is nationwide` },
        {
          value: false,
          label: `No - this ${
            this.type
          } is only available at specific locations`
        }
      ];
    }
  },
  methods: {
    async fetchOrganisations() {
      this.loading = true;
      let fetchedOrganisations = await this.fetchAll("/organisations", {
        "filter[has_permission]": true
      });
      fetchedOrganisations = fetchedOrganisations.map(organisation => {
        return { text: organisation.name, value: organisation.id };
      });
      this.organisations = [...this.organisations, ...fetchedOrganisations];
      this.loading = false;
    },
    onNameInput(name) {
      this.$emit("update:name", name);
      this.$emit("clear", "name");

      if (this.auth.isGlobalAdmin || this.isNew) {
        this.$emit("update:slug", this.slugify(name));
        this.$emit("clear", "slug");
      }
    }
  },
  created() {
    this.fetchOrganisations();
  }
};
</script>
