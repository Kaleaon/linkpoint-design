import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Custom React hook to manage WAI-ARIA menubar accessibility, roving focus,
 * and keyboard navigation for desktop menu headers and child dropdowns.
 *
 * Supports:
 * - Top-level horizontal navigation (ArrowRight, ArrowLeft, Home, End) with roving tabindex
 * - Dropdown expansion and initial item focus (ArrowDown, Space, Enter)
 * - Vertical item navigation within open dropdown (ArrowDown, ArrowUp, Home, End) with boundary wrapping
 * - Adjacent menu traversal from inside dropdown (ArrowLeft, ArrowRight)
 * - Dropdown dismissal with focus restoration to header (Escape)
 * - Item activation with action dispatch and header focus restoration (Enter, Space)
 *
 * @param {Object} options
 * @param {Array<{ label: string, items?: Array }>} [options.menus=[]] - List of top-level menu definitions
 * @param {string|null} [options.openMenu] - Controlled open menu label
 * @param {Function} [options.onOpenMenu] - Callback fired when open menu changes: (label | null) => void
 * @param {Function} [options.onSelect] - Callback fired when a dropdown item is selected: (menuLabel, item, itemIndex) => void
 * @param {string} [options.ariaLabel="Desktop Menu Bar"] - Accessible label for the menubar container
 * @returns {Object} Props, getters, and state for menubar components
 */
export function useMenuNavigation({
  menus = [],
  openMenu: controlledOpenMenu,
  onOpenMenu,
  onSelect,
  ariaLabel = "Desktop Menu Bar",
} = {}) {
  const isControlled = controlledOpenMenu !== undefined;
  const [uncontrolledOpenMenu, setUncontrolledOpenMenu] = useState(null);
  const currentOpenMenu = isControlled ? controlledOpenMenu : uncontrolledOpenMenu;

  const [focusedMenuIndex, setFocusedMenuIndex] = useState(0);
  const [focusedItemIndex, setFocusedItemIndex] = useState(-1);

  const headerRefs = useRef([]);
  const dropdownRefs = useRef([]);
  const itemRefs = useRef([]);
  const pendingFocusRef = useRef(null);

  const menuCount = menus.length;

  const getMenuLabel = useCallback((menu) => {
    if (typeof menu === "string") return menu;
    return menu?.label || "";
  }, []);

  const getMenuItems = useCallback((menu) => {
    if (!menu) return [];
    if (Array.isArray(menu.items)) return menu.items;
    return [];
  }, []);

  const safeFocusedMenuIndex =
    menuCount > 0
      ? Math.max(0, Math.min(focusedMenuIndex, menuCount - 1))
      : 0;

  const setOpenMenu = useCallback(
    (label) => {
      if (!isControlled) {
        setUncontrolledOpenMenu(label);
      }
      if (typeof onOpenMenu === "function") {
        onOpenMenu(label);
      }
    },
    [isControlled, onOpenMenu]
  );

  const closeMenu = useCallback(() => {
    setOpenMenu(null);
    setFocusedItemIndex(-1);
  }, [setOpenMenu]);

  // Align refs array size with menuCount
  useEffect(() => {
    headerRefs.current = headerRefs.current.slice(0, menuCount);
    dropdownRefs.current = dropdownRefs.current.slice(0, menuCount);
    itemRefs.current = itemRefs.current.slice(0, menuCount);
  }, [menuCount]);

  // Handle deferred focus when dropdown opens
  useEffect(() => {
    if (currentOpenMenu && pendingFocusRef.current) {
      const { menuIndex, itemIndex } = pendingFocusRef.current;
      const targetEl = itemRefs.current[menuIndex]?.[itemIndex];
      if (targetEl && typeof targetEl.focus === "function") {
        targetEl.focus();
        setFocusedItemIndex(itemIndex);
        pendingFocusRef.current = null;
      }
    }
  }, [currentOpenMenu, menus]);

  // Secondary effect to handle async element mount (e.g. dynamic items)
  useEffect(() => {
    if (currentOpenMenu && pendingFocusRef.current) {
      const timer = setTimeout(() => {
        if (pendingFocusRef.current) {
          const { menuIndex, itemIndex } = pendingFocusRef.current;
          const targetEl = itemRefs.current[menuIndex]?.[itemIndex];
          if (targetEl && typeof targetEl.focus === "function") {
            targetEl.focus();
            setFocusedItemIndex(itemIndex);
            pendingFocusRef.current = null;
          }
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentOpenMenu, menus]);

  const handleHeaderKeyDown = useCallback(
    (e, menuIndex) => {
      if (menuCount <= 0) return;

      const currentLabel = getMenuLabel(menus[menuIndex]);
      const isOpen = currentOpenMenu === currentLabel;
      const items = getMenuItems(menus[menuIndex]);
      const itemCount = items.length;

      let handled = false;

      switch (e.key) {
        case "ArrowRight": {
          e.preventDefault();
          handled = true;
          const nextIndex = (menuIndex + 1) % menuCount;
          setFocusedMenuIndex(nextIndex);
          if (isOpen) {
            const nextLabel = getMenuLabel(menus[nextIndex]);
            setOpenMenu(nextLabel);
          }
          if (headerRefs.current[nextIndex]) {
            headerRefs.current[nextIndex].focus();
          }
          break;
        }

        case "ArrowLeft": {
          e.preventDefault();
          handled = true;
          const prevIndex = (menuIndex - 1 + menuCount) % menuCount;
          setFocusedMenuIndex(prevIndex);
          if (isOpen) {
            const prevLabel = getMenuLabel(menus[prevIndex]);
            setOpenMenu(prevLabel);
          }
          if (headerRefs.current[prevIndex]) {
            headerRefs.current[prevIndex].focus();
          }
          break;
        }

        case "Home": {
          e.preventDefault();
          handled = true;
          setFocusedMenuIndex(0);
          if (isOpen) {
            setOpenMenu(getMenuLabel(menus[0]));
          }
          if (headerRefs.current[0]) {
            headerRefs.current[0].focus();
          }
          break;
        }

        case "End": {
          e.preventDefault();
          handled = true;
          const lastIndex = menuCount - 1;
          setFocusedMenuIndex(lastIndex);
          if (isOpen) {
            setOpenMenu(getMenuLabel(menus[lastIndex]));
          }
          if (headerRefs.current[lastIndex]) {
            headerRefs.current[lastIndex].focus();
          }
          break;
        }

        case "ArrowDown": {
          e.preventDefault();
          handled = true;
          if (!isOpen) {
            pendingFocusRef.current = { menuIndex, itemIndex: 0 };
            setOpenMenu(currentLabel);
          } else if (itemCount > 0 && itemRefs.current[menuIndex]?.[0]) {
            itemRefs.current[menuIndex][0].focus();
            setFocusedItemIndex(0);
          }
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          handled = true;
          const targetIndex = Math.max(0, itemCount - 1);
          if (!isOpen) {
            pendingFocusRef.current = { menuIndex, itemIndex: targetIndex };
            setOpenMenu(currentLabel);
          } else if (itemCount > 0 && itemRefs.current[menuIndex]?.[targetIndex]) {
            itemRefs.current[menuIndex][targetIndex].focus();
            setFocusedItemIndex(targetIndex);
          }
          break;
        }

        case "Enter":
        case " ": {
          e.preventDefault();
          handled = true;
          if (!isOpen) {
            pendingFocusRef.current = { menuIndex, itemIndex: 0 };
            setOpenMenu(currentLabel);
          } else {
            closeMenu();
            headerRefs.current[menuIndex]?.focus();
          }
          break;
        }

        case "Escape": {
          if (isOpen) {
            e.preventDefault();
            handled = true;
            closeMenu();
            headerRefs.current[menuIndex]?.focus();
          }
          break;
        }

        default:
          break;
      }

      if (handled) {
        e.stopPropagation();
      }
    },
    [menuCount, menus, currentOpenMenu, getMenuLabel, getMenuItems, setOpenMenu, closeMenu]
  );

  const handleItemKeyDown = useCallback(
    (e, menuIndex, itemIndex, item) => {
      const items = getMenuItems(menus[menuIndex]);
      const itemCount = items.length;
      if (itemCount <= 0) return;

      let handled = false;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          handled = true;
          const nextItemIndex = (itemIndex + 1) % itemCount;
          setFocusedItemIndex(nextItemIndex);
          if (itemRefs.current[menuIndex]?.[nextItemIndex]) {
            itemRefs.current[menuIndex][nextItemIndex].focus();
          }
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          handled = true;
          const prevItemIndex = (itemIndex - 1 + itemCount) % itemCount;
          setFocusedItemIndex(prevItemIndex);
          if (itemRefs.current[menuIndex]?.[prevItemIndex]) {
            itemRefs.current[menuIndex][prevItemIndex].focus();
          }
          break;
        }

        case "Home": {
          e.preventDefault();
          handled = true;
          setFocusedItemIndex(0);
          if (itemRefs.current[menuIndex]?.[0]) {
            itemRefs.current[menuIndex][0].focus();
          }
          break;
        }

        case "End": {
          e.preventDefault();
          handled = true;
          const lastItemIndex = itemCount - 1;
          setFocusedItemIndex(lastItemIndex);
          if (itemRefs.current[menuIndex]?.[lastItemIndex]) {
            itemRefs.current[menuIndex][lastItemIndex].focus();
          }
          break;
        }

        case "ArrowRight": {
          e.preventDefault();
          handled = true;
          const nextMenuIndex = (menuIndex + 1) % menuCount;
          const nextLabel = getMenuLabel(menus[nextMenuIndex]);
          setFocusedMenuIndex(nextMenuIndex);
          setFocusedItemIndex(-1);
          setOpenMenu(nextLabel);
          if (headerRefs.current[nextMenuIndex]) {
            headerRefs.current[nextMenuIndex].focus();
          }
          break;
        }

        case "ArrowLeft": {
          e.preventDefault();
          handled = true;
          const prevMenuIndex = (menuIndex - 1 + menuCount) % menuCount;
          const prevLabel = getMenuLabel(menus[prevMenuIndex]);
          setFocusedMenuIndex(prevMenuIndex);
          setFocusedItemIndex(-1);
          setOpenMenu(prevLabel);
          if (headerRefs.current[prevMenuIndex]) {
            headerRefs.current[prevMenuIndex].focus();
          }
          break;
        }

        case "Escape": {
          e.preventDefault();
          handled = true;
          closeMenu();
          if (headerRefs.current[menuIndex]) {
            headerRefs.current[menuIndex].focus();
          }
          break;
        }

        case "Enter":
        case " ": {
          e.preventDefault();
          handled = true;
          if (typeof onSelect === "function") {
            onSelect(getMenuLabel(menus[menuIndex]), item, itemIndex);
          }
          closeMenu();
          if (headerRefs.current[menuIndex]) {
            headerRefs.current[menuIndex].focus();
          }
          break;
        }

        case "Tab": {
          // Allow tab navigation to close dropdown and move naturally
          closeMenu();
          break;
        }

        default:
          break;
      }

      if (handled) {
        e.stopPropagation();
      }
    },
    [menus, menuCount, getMenuItems, getMenuLabel, setOpenMenu, closeMenu, onSelect]
  );

  const handleDropdownKeyDown = useCallback(
    (e, menuIndex) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
        if (headerRefs.current[menuIndex]) {
          headerRefs.current[menuIndex].focus();
        }
      }
    },
    [closeMenu]
  );

  const menubarProps = {
    role: "menubar",
    "aria-label": ariaLabel,
    onKeyDown: (e) => {
      if (e.key === "Tab") {
        closeMenu();
      }
    },
  };

  const getHeaderProps = useCallback(
    (menuIndex, menuLabel) => {
      const isFocused = menuIndex === safeFocusedMenuIndex;
      const label = menuLabel || getMenuLabel(menus[menuIndex]);
      const isOpen = currentOpenMenu === label;

      return {
        role: "menuitem",
        "aria-haspopup": "true",
        "aria-expanded": isOpen,
        tabIndex: isFocused ? 0 : -1,
        ref: (el) => {
          headerRefs.current[menuIndex] = el;
        },
        onClick: (e) => {
          e.stopPropagation();
          setFocusedMenuIndex(menuIndex);
          setOpenMenu(isOpen ? null : label);
        },
        onKeyDown: (e) => handleHeaderKeyDown(e, menuIndex),
        onFocus: () => {
          setFocusedMenuIndex(menuIndex);
        },
      };
    },
    [safeFocusedMenuIndex, currentOpenMenu, menus, getMenuLabel, setOpenMenu, handleHeaderKeyDown]
  );

  const getDropdownProps = useCallback(
    (menuIndex, menuLabel) => {
      const label = menuLabel || getMenuLabel(menus[menuIndex]);

      return {
        role: "menu",
        "aria-label": label,
        ref: (el) => {
          dropdownRefs.current[menuIndex] = el;
        },
        onKeyDown: (e) => handleDropdownKeyDown(e, menuIndex),
      };
    },
    [menus, getMenuLabel, handleDropdownKeyDown]
  );

  const getItemProps = useCallback(
    (menuIndex, itemIndex, item) => {
      return {
        role: "menuitem",
        tabIndex: -1,
        ref: (el) => {
          if (!itemRefs.current[menuIndex]) {
            itemRefs.current[menuIndex] = [];
          }
          itemRefs.current[menuIndex][itemIndex] = el;
        },
        onClick: (e) => {
          e.stopPropagation();
          if (typeof onSelect === "function") {
            onSelect(getMenuLabel(menus[menuIndex]), item, itemIndex);
          }
          closeMenu();
          if (headerRefs.current[menuIndex]) {
            headerRefs.current[menuIndex].focus();
          }
        },
        onKeyDown: (e) => handleItemKeyDown(e, menuIndex, itemIndex, item),
        onMouseEnter: () => {
          setFocusedItemIndex(itemIndex);
        },
      };
    },
    [menus, getMenuLabel, onSelect, closeMenu, handleItemKeyDown]
  );

  return {
    menubarProps,
    containerProps: menubarProps,
    getHeaderProps,
    getDropdownProps,
    getItemProps,
    focusedMenuIndex: safeFocusedMenuIndex,
    focusedItemIndex,
    setFocusedMenuIndex,
    setFocusedItemIndex,
    openMenu: currentOpenMenu,
    setOpenMenu,
    closeMenu,
  };
}

export default useMenuNavigation;
