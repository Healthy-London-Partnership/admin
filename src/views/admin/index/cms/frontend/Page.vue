<template>
  <gov-grid-row>
    <gov-grid-column width="two-thirds">
      <gov-heading size="l">{{$route.params.pageTitle}}</gov-heading>

      <gov-body>Review the content for the {{$route.params.pageTitle}} page on the frontend.</gov-body>

      <ck-text-input
        :key="'frontend-' + $route.params.pageSlug + '-title'"
        :value="frontend[$route.params.pageSlug].title"
        @input="onInput({ field: 'title', value: $event })"
        label="Title"
        :error="errors.get('cms.frontend[$route.params.pageSlug].title')"
        id="cms.frontend[$route.params.pageSlug].title"
      />

      <ck-wysiwyg-input
        :key="'frontend-' + $route.params.pageSlug + '-content'"
        :value="frontend[$route.params.pageSlug].content"
        @input="onInput({ field: 'content', value: $event })"
        label="Content"
        :error="errors.get('cms.frontend[$route.params.pageSlug].content')"
        id="cms.frontend[$route.params.pageSlug].content"
      />
    </gov-grid-column>
  </gov-grid-row>
</template>

<script>
export default {
  name: "CmsFrontendAbout",

  model: {
    prop: "frontend",
    event: "input"
  },

  props: {
    frontend: {
      type: Object,
      required: true
    },

    errors: {
      type: Object,
      required: true
    }
  },

  methods: {
    onInput({ field, value }) {
      const frontend = { ...this.frontend };

      frontend[this.$route.params.pageSlug][field] = value;

      this.$emit("input", frontend);
      this.$emit("clear", `frontend.${this.$route.params.pageSlug}.${field}`);
    }
  }
};
</script>
