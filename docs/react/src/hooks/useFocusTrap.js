import { useEffect } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Custom hook to trap focus within a container element and handle Escape key dismissal.
 *
 * @param {import("react").RefObject<HTMLElement>} ref - Ref pointing to the dialog container element
 * @param {() => void} [onEscape] - Callback fired when Escape key is pressed
 * @param {boolean} [active=true] - Whether the focus trap is active
 */
export function useFocusTrap(ref, onEscape, active = true) {
  useEffect(() => {
    if (!active || !ref || !ref.current) return;

    const container = ref.current;
    const previousActiveElement = document.activeElement;

    // Focus primary action button or the first focusable element inside container
    const focusInitial = () => {
      if (!container) return;
      const primaryEl = container.querySelector('[data-primary="true"]');
      const focusables = Array.from(
        container.querySelectorAll(FOCUSABLE_SELECTOR)
      );

      if (primaryEl && typeof primaryEl.focus === "function") {
        primaryEl.focus();
      } else if (
        focusables.length > 0 &&
        typeof focusables[0].focus === "function"
      ) {
        focusables[0].focus();
      }
    };

    const scheduleFocus =
      typeof requestAnimationFrame === "function"
        ? requestAnimationFrame
        : (cb) => setTimeout(cb, 0);
    const cancelSchedule =
      typeof cancelAnimationFrame === "function"
        ? cancelAnimationFrame
        : clearTimeout;

    const timerId = scheduleFocus(() => {
      focusInitial();
    });

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        e.stopPropagation();
        if (typeof onEscape === "function") {
          onEscape();
        }
        return;
      }

      if (e.key === "Tab") {
        const focusables = Array.from(
          container.querySelectorAll(FOCUSABLE_SELECTOR)
        ).filter(
          (el) =>
            el.offsetWidth > 0 ||
            el.offsetHeight > 0 ||
            el === document.activeElement
        );

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (
            document.activeElement === firstEl ||
            !container.contains(document.activeElement)
          ) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (
            document.activeElement === lastEl ||
            !container.contains(document.activeElement)
          ) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      cancelSchedule(timerId);
      window.removeEventListener("keydown", handleKeyDown, true);
      if (
        previousActiveElement &&
        typeof previousActiveElement.focus === "function"
      ) {
        previousActiveElement.focus();
      }
    };
  }, [ref, onEscape, active]);
}
