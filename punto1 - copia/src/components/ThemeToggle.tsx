interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button className="theme-toggle" onClick={onToggle} type="button">
      {theme === "light" ? "Modo noche" : "Modo dia"}
    </button>
  );
}
