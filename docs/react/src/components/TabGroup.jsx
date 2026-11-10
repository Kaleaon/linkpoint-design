import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useId,
  useEffect,
} from "react";

export const TabContext = createContext(null);

export function useTabContext() {
  return useContext(TabContext);
}

let fallbackCounter = 0;

export function TabGroup({
  activeIndex: controlledIndex,
  selectedIndex,
  defaultIndex = 0,
  onSelect,
  onChange,
  id: explicitId,
  baseId: explicitBaseId,
  orientation = "horizontal",
  as: Component = "div",
  style,
  className = "",
  children,
  ...props
}) {
  const reactId = typeof useId === "function" ? useId() : null;
  const [fallbackId] = useState(() => {
    fallbackCounter += 1;
    return `tabgroup-${fallbackCounter}`;
  });

  const baseId =
    explicitBaseId ||
    explicitId ||
    (reactId ? `tabgroup-${reactId.replace(/:/g, "")}` : fallbackId);

  const active =
    controlledIndex !== undefined ? controlledIndex : selectedIndex;
  const isControlled = active !== undefined;
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex ?? 0);
  const currentActiveIndex = isControlled ? active : uncontrolledIndex;

  const tabRefs = useRef([]);
  const registeredTabsCount = useRef(0);
  const isKeyboardNav = useRef(false);

  const handleSelect = useCallback(
    (index) => {
      if (!isControlled) {
        setUncontrolledIndex(index);
      }
      onSelect?.(index);
      onChange?.(index);
    },
    [isControlled, onSelect, onChange],
  );

  const registerTab = useCallback((index, el) => {
    tabRefs.current[index] = el;
    if (index >= registeredTabsCount.current) {
      registeredTabsCount.current = index + 1;
    }
  }, []);

  const getTabId = useCallback((index) => `${baseId}-tab-${index}`, [baseId]);

  const getPanelId = useCallback(
    (index) => `${baseId}-panel-${index}`,
    [baseId],
  );

  // Focus newly active tab if selection change was triggered via keyboard navigation
  useEffect(() => {
    if (isKeyboardNav.current) {
      const activeEl = tabRefs.current[currentActiveIndex];
      if (activeEl && typeof activeEl.focus === "function") {
        activeEl.focus();
      }
      isKeyboardNav.current = false;
    }
  }, [currentActiveIndex]);

  const contextValue = {
    baseId,
    activeIndex: currentActiveIndex,
    onSelect: handleSelect,
    orientation,
    tabRefs,
    registeredTabsCount,
    isKeyboardNav,
    registerTab,
    getTabId,
    getPanelId,
  };

  if (!Component) {
    return (
      <TabContext.Provider value={contextValue}>{children}</TabContext.Provider>
    );
  }

  return (
    <TabContext.Provider value={contextValue}>
      <Component
        className={`tab-group ${className}`.trim()}
        style={style}
        {...props}
      >
        {children}
      </Component>
    </TabContext.Provider>
  );
}

export function TabList({
  children,
  ariaLabel,
  "aria-label": ariaLabelProp,
  as: Component = "div",
  style,
  className = "",
  onKeyDown: customKeyDown,
  ...props
}) {
  const context = useTabContext();
  const baseLabel = ariaLabelProp || ariaLabel;

  const handleKeyDown = (e) => {
    customKeyDown?.(e);
    if (e.defaultPrevented || !context) return;

    const {
      activeIndex,
      onSelect,
      orientation,
      tabRefs,
      registeredTabsCount,
      isKeyboardNav,
    } = context;

    const count =
      registeredTabsCount.current || tabRefs.current.filter(Boolean).length;
    if (count <= 0) return;

    const isHorizontal = orientation === "horizontal";
    let nextIndex = activeIndex;
    let handled = false;

    switch (e.key) {
      case "ArrowRight":
        if (isHorizontal) {
          nextIndex = (activeIndex + 1) % count;
          handled = true;
        }
        break;
      case "ArrowLeft":
        if (isHorizontal) {
          nextIndex = (activeIndex - 1 + count) % count;
          handled = true;
        }
        break;
      case "ArrowDown":
        if (!isHorizontal) {
          nextIndex = (activeIndex + 1) % count;
          handled = true;
        }
        break;
      case "ArrowUp":
        if (!isHorizontal) {
          nextIndex = (activeIndex - 1 + count) % count;
          handled = true;
        }
        break;
      case "Home":
        nextIndex = 0;
        handled = true;
        break;
      case "End":
        nextIndex = count - 1;
        handled = true;
        break;
      case "Enter":
      case " ":
        if (activeIndex >= 0 && activeIndex < count) {
          onSelect(activeIndex);
          handled = true;
        }
        break;
      default:
        break;
    }

    if (handled) {
      e.preventDefault();
      if (nextIndex !== activeIndex) {
        isKeyboardNav.current = true;
        onSelect(nextIndex);
        if (tabRefs.current[nextIndex]) {
          tabRefs.current[nextIndex].focus();
        }
      }
    }
  };

  return (
    <Component
      role="tablist"
      aria-label={baseLabel}
      aria-orientation={
        context?.orientation !== "horizontal" ? context?.orientation : undefined
      }
      onKeyDown={handleKeyDown}
      className={`tab-list ${className}`.trim()}
      style={style}
      {...props}
    >
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        if (child.type === Tab && child.props.index === undefined) {
          return React.cloneElement(child, { index: idx });
        }
        return child;
      })}
    </Component>
  );
}

export function Tab({
  index = 0,
  disabled = false,
  ariaLabel,
  "aria-label": ariaLabelProp,
  as: Component = "div",
  style,
  className = "",
  onClick,
  onKeyDown,
  children,
  ...props
}) {
  const context = useTabContext();
  const tabRef = useRef(null);

  useEffect(() => {
    if (context && tabRef.current) {
      context.registerTab(index, tabRef.current);
    }
  }, [context, index]);

  const isSelected = context ? context.activeIndex === index : false;
  const tabId = context ? context.getTabId(index) : undefined;
  const panelId = context ? context.getPanelId(index) : undefined;
  const accessibleLabel = ariaLabelProp || ariaLabel;

  const handleClick = (e) => {
    onClick?.(e);
    if (!disabled && context) {
      context.onSelect(index);
    }
  };

  const handleKeyDown = (e) => {
    onKeyDown?.(e);
    if (e.key === "Enter" || e.key === " ") {
      if (!disabled && context) {
        e.preventDefault();
        context.onSelect(index);
      }
    }
  };

  return (
    <Component
      role="tab"
      id={tabId}
      aria-controls={panelId}
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      aria-label={accessibleLabel}
      tabIndex={isSelected ? 0 : -1}
      ref={(el) => {
        tabRef.current = el;
        if (context) {
          context.registerTab(index, el);
        }
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`tab ${isSelected ? "tab-selected" : ""} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}

export function TabPanel({
  index,
  baseId: explicitBaseId,
  as: Component = "div",
  style,
  className = "",
  children,
  ...props
}) {
  const context = useTabContext();

  const panelIndex =
    index !== undefined ? index : context ? context.activeIndex : 0;
  const resolvedBaseId = explicitBaseId || (context ? context.baseId : null);

  const panelId = resolvedBaseId
    ? `${resolvedBaseId}-panel-${panelIndex}`
    : context
      ? context.getPanelId(panelIndex)
      : undefined;

  const tabId = resolvedBaseId
    ? `${resolvedBaseId}-tab-${panelIndex}`
    : context
      ? context.getTabId(panelIndex)
      : undefined;

  return (
    <Component
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      className={`tab-panel ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}

TabGroup.TabList = TabList;
TabGroup.Tab = Tab;
TabGroup.TabPanel = TabPanel;

export default TabGroup;
