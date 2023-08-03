export const Routes = {
  dashboard: '/',
  login: '/login',
  profile: '/profile',
  devices: {
    ...routesFactory('/devices'),
  },
  clients: {
    ...routesFactory('/clients'),
  },
  sims: {
    ...routesFactory('/sims'),
  },
  customers: {
    ...routesFactory('/customers'),
  },
  usages: {
    ...routesFactory('/usages'),
  },
  files: {
    ...routesFactory('/files'),
  },
};

function routesFactory(endpoint: string) {
  return {
    list: `${endpoint}`,
    create: `${endpoint}/create`,
    create_bulk: `${endpoint}/create/bulk`,
    editWithoutLang: (slug: string, shop?: string) => {
      return shop
        ? `/${shop}${endpoint}/${slug}/edit`
        : `${endpoint}/${slug}/edit`;
    },
    edit: (slug: string, language: string, shop?: string) => {
      return shop
        ? `/${language}/${shop}${endpoint}/${slug}/edit`
        : `${language}${endpoint}/${slug}/edit`;
    },
    translate: (slug: string, language: string, shop?: string) => {
      return shop
        ? `/${language}/${shop}${endpoint}/${slug}/translate`
        : `${language}${endpoint}/${slug}/translate`;
    },
    details: (slug: string) => `${endpoint}/${slug}`,
  };
}
