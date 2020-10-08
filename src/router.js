import Vue from "vue";
import Router from "vue-router";
import Auth from "@/classes/Auth";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/Login"),
      meta: { auth: false }
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("@/views/auth/Logout")
    },
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/views/Dashboard"),
      meta: { auth: true }
    },
    {
      path: "/organisations",
      name: "organisations-index",
      component: () => import("@/views/organisations/Index"),
      meta: { auth: true }
    },
    {
      path: "/organisations/create",
      name: "organisations-create",
      component: () => import("@/views/organisations/Create"),
      meta: { auth: true }
    },
    {
      path: "/organisations/import",
      name: "organisations-import",
      component: () => import("@/views/organisations/Import"),
      meta: { auth: true }
    },
    {
      path: "/organisations/:organisation",
      name: "organisations-show",
      component: () => import("@/views/organisations/Show"),
      meta: { auth: true }
    },
    {
      path: "/organisations/:organisation/edit",
      name: "organisations-edit",
      component: () => import("@/views/organisations/Edit"),
      meta: { auth: true }
    },
    {
      path: "/referrals",
      name: "referrals-index",
      component: () => import("@/views/referrals/Index"),
      meta: { auth: true }
    },
    {
      path: "/referrals/:referral/confirmation",
      name: "referrals-confirmation",
      component: () => import("@/views/referrals/Confirmation"),
      meta: { auth: true }
    },
    {
      path: "/referrals/:referral",
      name: "referrals-show",
      component: () => import("@/views/referrals/Show"),
      meta: { auth: true }
    },
    {
      path: "/locations",
      name: "locations-index",
      component: () => import("@/views/locations/Index"),
      meta: { auth: true }
    },
    {
      path: "/locations/create",
      name: "locations-create",
      component: () => import("@/views/locations/Create"),
      meta: { auth: true }
    },
    {
      path: "/locations/:location",
      name: "locations-show",
      component: () => import("@/views/locations/Show"),
      meta: { auth: true }
    },
    {
      path: "/locations/:location/edit",
      name: "locations-edit",
      component: () => import("@/views/locations/Edit"),
      meta: { auth: true }
    },
    {
      path: "/users",
      name: "users-index",
      component: () => import("@/views/users/Index"),
      meta: { auth: true }
    },
    {
      path: "/users/create",
      name: "users-create",
      component: () => import("@/views/users/Create"),
      meta: { auth: true }
    },
    {
      path: "/users/:user",
      name: "users-show",
      component: () => import("@/views/users/Show"),
      meta: { auth: true }
    },
    {
      path: "/users/:user/edit",
      name: "users-edit",
      component: () => import("@/views/users/Edit"),
      meta: { auth: true }
    },
    {
      path: "/services",
      name: "services-index",
      component: () => import("@/views/services/Index"),
      meta: { auth: true }
    },
    {
      path: "/services/pre-create",
      name: "services-pre-create",
      component: () => import("@/views/services/PreCreate"),
      meta: { auth: true }
    },
    {
      path: "/services/create",
      name: "services-create",
      component: () => import("@/views/services/Create"),
      meta: { auth: true }
    },
    {
      path: "/services/import",
      name: "services-import",
      component: () => import("@/views/services/Import"),
      meta: { auth: true }
    },
    {
      path: "/services/:service/created",
      name: "services-post-create",
      component: () => import("@/views/services/PostCreate"),
      meta: { auth: true }
    },
    {
      path: "/services/:service",
      component: () => import("@/views/services/Show"),
      meta: { auth: true },
      children: [
        {
          path: "",
          name: "services-show",
          component: () => import("@/views/services/show/DetailsTab")
        },
        {
          path: "additional-info",
          name: "services-show-additional-info",
          component: () => import("@/views/services/show/AdditionalInfoTab")
        },
        {
          path: "useful-info",
          name: "services-show-useful-info",
          component: () => import("@/views/services/show/UsefulInfoTab")
        },
        {
          path: "contact-info",
          name: "services-show-contact-info",
          component: () => import("@/views/services/show/ContactInfoTab")
        },
        {
          path: "who-for",
          name: "services-show-who-for",
          component: () => import("@/views/services/show/WhoForTab")
        },
        {
          path: "locations",
          name: "services-show-locations",
          component: () => import("@/views/services/show/LocationsTab")
        },
        {
          path: "referral",
          name: "services-show-referral",
          component: () => import("@/views/services/show/ReferralTab")
        }
      ]
    },
    {
      path: "/services/:service/edit",
      name: "services-edit",
      component: () => import("@/views/services/Edit"),
      meta: { auth: true }
    },
    {
      path: "/services/:service/refresh",
      name: "services-refresh",
      component: () => import("@/views/services/Refresh")
    },
    {
      path: "/services/:service/service-locations/create",
      name: "service-locations-create",
      component: () => import("@/views/service-locations/Create"),
      meta: { auth: true }
    },
    {
      path: "/service-locations/:serviceLocation",
      name: "service-locations-show",
      component: () => import("@/views/service-locations/Show"),
      meta: { auth: true }
    },
    {
      path: "/service-locations/:serviceLocation/edit",
      name: "service-locations-edit",
      component: () => import("@/views/service-locations/Edit"),
      meta: { auth: true }
    },
    {
      path: "/reports",
      component: () => import("@/views/reports/Index"),
      meta: { auth: true },
      children: [
        {
          path: "",
          name: "reports-index",
          component: () => import("@/views/reports/View")
        },
        {
          path: "edit",
          name: "reports-edit",
          component: () => import("@/views/reports/Edit")
        }
      ]
    },
    {
      path: "/admin",
      component: () => import("@/views/admin/Index"),
      meta: { auth: true },
      children: [
        {
          path: "",
          name: "admin-index",
          component: () => import("@/views/admin/index/AuditLogs")
        },
        {
          path: "notifications",
          name: "admin-index-notifications",
          component: () => import("@/views/admin/index/Notifications")
        },
        {
          path: "feedback",
          name: "admin-index-feedback",
          component: () => import("@/views/admin/index/Feedback")
        },
        {
          path: "taxonomies",
          component: () => import("@/views/admin/index/Taxonomies"),
          children: [
            {
              path: "",
              name: "admin-index-taxonomies",
              component: () =>
                import("@/views/admin/index/taxonomies/Categories")
            },
            {
              path: "organisations",
              name: "admin-index-taxonomies-organisations",
              component: () =>
                import("@/views/admin/index/taxonomies/Organisations")
            }
          ]
        },
        {
          path: "collections",
          component: () => import("@/views/admin/index/Collections"),
          children: [
            {
              path: "",
              name: "admin-index-collections",
              component: () =>
                import("@/views/admin/index/collections/Categories")
            },
            {
              path: "organisations",
              name: "admin-index-collections-personas",
              component: () =>
                import("@/views/admin/index/collections/Personas")
            }
          ]
        },
        {
          path: "search-engine",
          component: () => import("@/views/admin/index/SearchEngine"),
          children: [
            {
              path: "",
              name: "admin-index-search-engine",
              component: () =>
                import("@/views/admin/index/search-engine/Thesaurus")
            },
            {
              path: "stop-words",
              name: "admin-index-search-engine-stop-words",
              component: () =>
                import("@/views/admin/index/search-engine/StopWords")
            }
          ]
        },
        {
          path: "cms",
          component: () => import("@/views/admin/index/Cms"),
          children: [
            {
              path: "",
              name: "admin-index-cms",
              component: () => import("@/views/admin/index/cms/frontend/Global")
            },
            {
              path: "frontend/home",
              name: "admin-index-cms-frontend-home",
              component: () => import("@/views/admin/index/cms/frontend/Home")
            },
            {
              path: "frontend/terms-and-conditions",
              name: "admin-index-cms-frontend-terms-and-conditions",
              component: () =>
                import("@/views/admin/index/cms/frontend/TermsAndConditions")
            },
            {
              path: "frontend/privacy-policy",
              name: "admin-index-cms-frontend-privacy-policy",
              component: () =>
                import("@/views/admin/index/cms/frontend/PrivacyPolicy")
            },
            {
              path: "frontend/about",
              name: "admin-index-cms-frontend-about",
              component: () => import("@/views/admin/index/cms/frontend/About")
            },
            {
              path: "frontend/contact",
              name: "admin-index-cms-frontend-contact",
              component: () =>
                import("@/views/admin/index/cms/frontend/Contact")
            },
            {
              path: "frontend/get-involved",
              name: "admin-index-cms-frontend-get-involved",
              component: () =>
                import("@/views/admin/index/cms/frontend/GetInvolved")
            },
            {
              path: "frontend/favourites",
              name: "admin-index-cms-frontend-favourites",
              component: () =>
                import("@/views/admin/index/cms/frontend/Favourites")
            }
          ]
        },
        {
          path: "cms/updated",
          name: "admin-index-cms-updated",
          component: () => import("@/views/admin/index/cms/Updated")
        }
      ]
    },
    {
      path: "/audits/:audit",
      name: "audits-show",
      component: () => import("@/views/audits/Show"),
      meta: { auth: true }
    },
    {
      path: "/notifications/:notification",
      name: "notifications-show",
      component: () => import("@/views/notifications/Show"),
      meta: { auth: true }
    },
    {
      path: "/page-feedbacks/:pageFeedback",
      name: "page-feedbacks-show",
      component: () => import("@/views/page-feedbacks/Show"),
      meta: { auth: true }
    },
    {
      path: "/taxonomies/categories/create",
      name: "taxonomies-categories-create",
      component: () => import("@/views/taxonomies/categories/Create"),
      meta: { auth: true }
    },
    {
      path: "/taxonomies/categories/:taxonomy/edit",
      name: "taxonomies-categories-edit",
      component: () => import("@/views/taxonomies/categories/Edit"),
      meta: { auth: true }
    },
    {
      path: "/taxonomies/organisations/create",
      name: "taxonomies-organisations-create",
      component: () => import("@/views/taxonomies/organisations/Create"),
      meta: { auth: true }
    },
    {
      path: "/taxonomies/organisations/:taxonomy/edit",
      name: "taxonomies-organisations-edit",
      component: () => import("@/views/taxonomies/organisations/Edit"),
      meta: { auth: true }
    },
    {
      path: "/collections/categories/create",
      name: "collections-categories-create",
      component: () => import("@/views/collections/categories/Create"),
      meta: { auth: true }
    },
    {
      path: "/collections/categories/:collection/edit",
      name: "collections-categories-edit",
      component: () => import("@/views/collections/categories/Edit"),
      meta: { auth: true }
    },
    {
      path: "/collections/personas/create",
      name: "collections-personas-create",
      component: () => import("@/views/collections/personas/Create"),
      meta: { auth: true }
    },
    {
      path: "/collections/personas/:collection/edit",
      name: "collections-personas-edit",
      component: () => import("@/views/collections/personas/Edit"),
      meta: { auth: true }
    },
    {
      path: "/thesuarus/edit",
      name: "thesaurus-edit",
      component: () => import("@/views/thesaurus/Edit"),
      meta: { auth: true }
    },
    {
      path: "/stop-words/edit",
      name: "stop-words-edit",
      component: () => import("@/views/stop-words/Edit"),
      meta: { auth: true }
    },
    {
      path: "/register",
      component: () => import("@/views/register/Index"),
      children: [
        {
          path: "",
          name: "register-index",
          component: () => import("@/views/register/index/Eligibility"),
          meta: { auth: false }
        },
        {
          path: "user",
          name: "register-index-user",
          component: () => import("@/views/register/index/User"),
          meta: { auth: false }
        },
        {
          path: "organisation",
          name: "register-index-organisation",
          component: () => import("@/views/register/index/Organisation"),
          meta: { auth: false }
        },
        {
          path: "service",
          name: "register-index-service",
          component: () => import("@/views/register/index/Service"),
          meta: { auth: false }
        },
        {
          path: "success",
          name: "register-index-success",
          component: () => import("@/views/register/index/Success"),
          meta: { auth: false }
        }
      ]
    },
    {
      path: "/organisation-admin-invites/submitted",
      name: "organisation-admin-invites-submitted",
      meta: { auth: false },
      component: () => import("@/views/organisation-admin-invites/Submitted")
    },
    {
      path: "/organisation-admin-invites/:organisationAdminInvite",
      name: "organisation-admin-invites-start",
      meta: { auth: false },
      component: () => import("@/views/organisation-admin-invites/Start")
    },
    {
      path: "/organisation-admin-invites/:organisationAdminInvite/create-user",
      name: "organisation-admin-invites-create-user",
      meta: { auth: false },
      component: () => import("@/views/organisation-admin-invites/CreateUser")
    },
    {
      path: "/pending-organisation-admins/:pendingOrganisationAdmin/confirm",
      name: "pending-organisation-admins-confirm",
      meta: { auth: false },
      component: () => import("@/views/pending-organisation-admins/Confirm")
    },
    {
      path: "*",
      name: "404",
      component: () => import("@/views/errors/404")
    }
  ]
});

// Middleware.
router.beforeEach((to, from, next) => {
  // If the user is logged in but has been inactive for too long.
  if (
    Auth.isLoggedIn &&
    Auth.inactive() &&
    !["login", "logout"].includes(to.name)
  ) {
    return next({ name: "logout" });
  }

  // If the user is logged in, then update their activity.
  if (Auth.isLoggedIn) {
    Auth.invokeActivity();
  }

  // If user needs to be authenticated, then redirect them to the auth URL.
  if (to.matched.some(route => route.meta.auth)) {
    if (!Auth.isLoggedIn) {
      return next({ name: "login" });
    }
  }

  next();
});

export default router;
