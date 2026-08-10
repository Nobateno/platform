import {
  useCallback,
  useMemo,
} from "react";
import {
  Link as RouterLink,
  useLocation as useRouterLocation,
  useNavigate as useRouterNavigate,
  type LinkProps as RouterLinkProps,
} from "react-router-dom";

export interface NavigationLocation {
  pathname: string;
  search: string;
  forceActiveMenu?: string;
}

export type NavigateFunction = (href: string) => void;

export interface LinkProps extends Omit<RouterLinkProps, "to"> {
  to: string;
}

export function Link({ to, ...props }: LinkProps) {
  const href =
    to.startsWith("/") || to.startsWith("?") || to.startsWith("#")
      ? to
      : `/${to}`;

  return <RouterLink to={href} {...props} />;
}

export function useLocation(): NavigationLocation {
  const { pathname, search } = useRouterLocation();

  return useMemo(
    () => ({ pathname, search }),
    [pathname, search]
  );
}

export function useNavigate(): NavigateFunction {
  const { pathname } = useRouterLocation();
  const navigate = useRouterNavigate();

  return useCallback(
    (href: string) => {
      const normalizedHref =
        href.startsWith("/") || href.startsWith("?") || href.startsWith("#")
          ? href
          : `/${href}`;
      const targetPathname = normalizedHref.startsWith("/")
        ? normalizedHref.split(/[?#]/, 1)[0]
        : pathname;

      navigate(normalizedHref);
      if (targetPathname !== pathname) {
        window.scrollTo({ top: 0 });
      }
    },
    [navigate, pathname]
  );
}
