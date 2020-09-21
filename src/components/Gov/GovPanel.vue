<template>
  <div class="govuk-panel govuk-panel--confirmation">
    <h1 class="govuk-panel__title">
      <slot name="title" />
    </h1>

    <div class="govuk-panel__body">
      <slot name="body" />
    </div>
  </div>
</template>
