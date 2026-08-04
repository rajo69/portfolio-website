import type Lenis from "lenis";

/**
 * The live Lenis instance, so components outside SmoothScroll can pause it.
 *
 * A module singleton rather than context on purpose: the only consumers are
 * imperative (lock the page while a dialog is open), and a provider would put
 * a re-render in the path of every scroll-driven component for no gain.
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

/**
 * Stop the page scrolling, and return the function that undoes it.
 *
 * Two paths, because Lenis is not always running. When it is, `stop()` is the
 * correct lock: it preventDefaults wheel and touch at the source, which is the
 * only scroll input that matters on the viewports this is used at. When the
 * visitor has asked for reduced motion, SmoothScroll never constructs Lenis at
 * all, so there is nothing to stop and the document has to be locked directly.
 *
 * Deliberately not touching `document.documentElement.style.overflow` in the
 * Lenis path: Lenis measures its scroll limit from that element, and changing
 * its overflow mid-flight is exactly the class of bug that stranded the blog
 * pages at half height.
 */
export function lockScroll(): () => void {
  if (instance) {
    const lenis = instance;
    lenis.stop();
    return () => lenis.start();
  }

  const el = document.documentElement;
  const previous = el.style.overflow;
  el.style.overflow = "hidden";
  return () => {
    el.style.overflow = previous;
  };
}
