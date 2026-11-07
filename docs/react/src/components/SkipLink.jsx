export default function SkipLink({
  targetId = "main-content",
  label = "Skip to main content",
  className = "skip-link",
}) {
  const handleClick = (e) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView?.({ block: "start" });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
      }
      handleClick(e);
    }
  };

  return (
    <a
      href={`#${targetId}`}
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {label}
    </a>
  );
}
