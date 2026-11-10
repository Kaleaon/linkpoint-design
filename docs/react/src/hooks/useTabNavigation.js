import { useRef, useCallback, useEffect, useId, useState } from "react";

let navIdCounter = 0;

/**
 * Custom hook to manage WAI-ARIA tablist accessibility, roving tabindex,
 * horizontal keyboard arrow navigation (ArrowLeft, ArrowRight, Home, End),
 * and dynamic ID binding between tabs and panels.
 *
 * @param {Object} options
 * @param {number} options.itemCount - Total number of tabs in the tablist.
 * @param {number} options.activeIndex - Index of the currently active tab.
 * @param {Function} options.onSelect - Callback invoked when a tab is selected: (index) => void.
 * @param {string} options.ariaLabel - Accessible label for the tablist container.
 * @param {string} [options.baseId] - Optional base ID for tab and panel element IDs.
 * @returns {Object} { containerProps, getTabProps, getPanelProps, baseId }
 */
export function useTabNavigation({
  itemCount,
  activeIndex,
  onSelect,
  ariaLabel,
  baseId: explicitBaseId,
}) {
  const reactId = typeof useId === "function" ? useId() : null;
  const [fallbackId] = useState(() => {
    navIdCounter += 1;
    return `tabnav-${navIdCounter}`;
  });

  const baseId =
    explicitBaseId ||
    (reactId ? `tabnav-${reactId.replace(/:/g, "")}` : fallbackId);
  const tabRefs = useRef([]);
  const isKeyboardNav = useRef(false);

  const safeActiveIndex =
    itemCount > 0 && activeIndex >= 0 && activeIndex < itemCount
      ? activeIndex
      : 0;

  // Align refs array size with itemCount
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, itemCount);
  }, [itemCount]);

  // Focus newly active tab if selection change was triggered via keyboard navigation
  useEffect(() => {
    if (isKeyboardNav.current) {
      if (
        safeActiveIndex >= 0 &&
        safeActiveIndex < itemCount &&
        tabRefs.current[safeActiveIndex]
      ) {
        tabRefs.current[safeActiveIndex].focus();
      }
      isKeyboardNav.current = false;
    }
  }, [safeActiveIndex, itemCount]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!itemCount || itemCount <= 0) return;

      let nextIndex = safeActiveIndex;
      let handled = false;

      switch (e.key) {
        case "ArrowRight":
          nextIndex = (safeActiveIndex + 1) % itemCount;
          handled = true;
          break;
        case "ArrowLeft":
          nextIndex = (safeActiveIndex - 1 + itemCount) % itemCount;
          handled = true;
          break;
        case "Home":
          nextIndex = 0;
          handled = true;
          break;
        case "End":
          nextIndex = itemCount - 1;
          handled = true;
          break;
        case "Enter":
        case " ":
          if (safeActiveIndex >= 0 && safeActiveIndex < itemCount) {
            onSelect(safeActiveIndex);
            handled = true;
          }
          break;
        default:
          break;
      }

      if (handled) {
        e.preventDefault();
        if (nextIndex !== safeActiveIndex) {
          isKeyboardNav.current = true;
          onSelect(nextIndex);
          if (tabRefs.current[nextIndex]) {
            tabRefs.current[nextIndex].focus();
          }
        }
      }
    },
    [itemCount, safeActiveIndex, onSelect],
  );

  const containerProps = {
    role: "tablist",
    "aria-label": ariaLabel,
    onKeyDown: handleKeyDown,
  };

  const getTabProps = useCallback(
    (index) => {
      const isSelected = index === safeActiveIndex;
      return {
        role: "tab",
        id: `${baseId}-tab-${index}`,
        "aria-controls": `${baseId}-panel-${index}`,
        "aria-selected": isSelected,
        tabIndex: isSelected ? 0 : -1,
        ref: (el) => {
          tabRefs.current[index] = el;
        },
        onClick: () => {
          onSelect(index);
        },
      };
    },
    [baseId, safeActiveIndex, onSelect],
  );

  const getPanelProps = useCallback(
    (index) => {
      const panelIndex = index !== undefined ? index : safeActiveIndex;
      return {
        role: "tabpanel",
        id: `${baseId}-panel-${panelIndex}`,
        "aria-labelledby": `${baseId}-tab-${panelIndex}`,
        tabIndex: 0,
      };
    },
    [baseId, safeActiveIndex],
  );

  return {
    baseId,
    containerProps,
    getTabProps,
    getPanelProps,
  };
}

export default useTabNavigation;
