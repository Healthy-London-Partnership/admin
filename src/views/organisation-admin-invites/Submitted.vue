<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Submitted`" />

    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="two-thirds">
          <gov-panel class="bg-primary">
            <template slot="title">Account created</template>

            <template slot="body">
              Email with a confirmation link sent to xxx.
            </template>
          </gov-panel>

          <gov-body>
            We have sent an email with a confirmation link to your email
            address. In order to complete the process, please click the
            confirmation link.
          </gov-body>

          <gov-body>
            If you do not receive a confirmation email, please check your spam
            folder.
          </gov-body>

          <gov-heading size="l">What happens next</gov-heading>

          <gov-body>
            Once you've confirmed you email address, you'll be able to claim
            your listing and be able to start editing your organisation details
            and adding services that your organisation offers. This can take up
            to 20 minutes.
          </gov-body>

          <gov-body>
            Once you have added one service, your listing will be visible for
            anyone to see.
          </gov-body>

          <gov-heading size="l">Questions?</gov-heading>

          <gov-body>
            If you have any questions, please refer to our <gov-link
              :href="faqsLink"
              external
            >FAQs</gov-link>.
          </gov-body>
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
export default {
  data() {
    return {
      faqsLink: `${process.env.VUE_APP_FRONTEND_URI}/about`
    }
  }
}
</script>
