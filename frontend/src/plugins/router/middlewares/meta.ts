import { defu } from 'defu';
import { ref } from 'vue';
import type {
  RouteLocationNormalized,
  RouteLocationRaw,
  RouteMeta
} from 'vue-router/auto';

const defaultMeta: RouteMeta = {
  layout: 'default',
  transparentLayout: false,
  admin: false,
  backdrop: {
    opacity: 0.25
  }
};

const reactiveMeta = ref(structuredClone(defaultMeta));

/**
 * This middleware handles the meta property between routes
 *
 * The layout of the destination page needs to exist before the route
 * is accessed. This is why we need the following block in pages:
 *
 * <route lang="yaml">
 *  meta:
 *    layout: server
 * </route>
 *
 * That block is also needed when a property needs to be resolved before
 * the component is instantiated (i.e, the admin property, so the correct redirection is done)
 *
 * That populates the meta property through Vite at build time, so the router
 * instantiation looks like this: https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields
 *
 * If we want to change the meta at runtime (for page title, backdrop, etc), we need to merge
 * whatever default value is defined in the route block with our custom properties. In order
 * to ensure consistency, we pass an object with defaults that matches the *RouteMeta* type
 * present at the plugins.d.ts file
 */
export function metaGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): boolean | RouteLocationRaw {
  /**
   * Skip if it's in the same page (i.e for param or query changes)
   */
  if (from.path !== to.path) {
    reactiveMeta.value = defu(to.meta, structuredClone(defaultMeta));
    to.meta = reactiveMeta.value;

    if (from.meta.transition?.leave) {
      if (to.meta.transition) {
        to.meta.transition.enter = from.meta.transition.leave;
      } else {
        to.meta.transition = { enter: from.meta.transition.leave };
      }
    }
  }

  return true;
}
