import RootComponentMap from '@/pages/RootComponent';
import { getLanguageKey } from '@/utils';
import Profile from '@/pages/user/profile';
import ChangePassword from '@/pages/user/change-password';

interface PageProps {
  id: string,
  component: string,
  path?: string,
  name?: string,
  icon?: string,
  exact?: boolean,
  hideInMenu?: boolean
}

interface ModuleProps {
  id: string,
  path?: string,
  name?: string,
  icon?: string,
  component?: string,
  pages?: PageProps[],
  exact?: boolean,
  hideInMenu?: boolean
}

export const mapRoutes = (routes = []) => {
  return routes.map((module: ModuleProps) => (
    module.id
      ? {
        path: module.path,
        name: module.name?.[getLanguageKey() || 'vi'],
        icon: module.icon,
        // component: RootComponentMap[module.id]?.[module.component],
        component: '',
        exact: module.exact,
        hideInMenu: module.hideInMenu,
        hideInBreadcrumb: (
          (
            module?.pages
            && module?.pages?.length <= 1
            && !module.pages?.[0].hideInMenu
          ) || (
            module?.pages
            && module.pages?.length > 1
          )
        ),
        routes: (module.pages || []).map((page) => ({
          path: page.path,
          name: page.name?.[getLanguageKey() || 'vi'],
          icon: page.icon,
          component: RootComponentMap[module.id]?.[page.component],
          exact: page.exact,
          hideInMenu: page.hideInMenu,
          hideInBreadcrumb: false,
        })),
      }
      : module
    )
  );
};

export const resetRoutes = () => {
  // @ts-ignore
  globalThis.routes[0].routes[1].routes = [
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      hideInMenu: true
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePassword,
      hideInMenu: true
    }
  ]
}

export const setRoutes = (routes: any[]) => {
  resetRoutes();
  // @ts-ignore
  globalThis.routes[0].routes[1].routes.push(...routes);
};
