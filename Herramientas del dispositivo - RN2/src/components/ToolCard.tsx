import type { ReactNode } from 'react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  accent: string;
  action: string;
  onAction: () => void;
  active?: boolean;
  children?: ReactNode;
}

export function ToolCard({ title, description, icon, accent, action, onAction, active, children }: ToolCardProps) {
  return (
    <article className={`tool-card ${active ? 'is-active' : ''}`} style={{ '--accent': accent } as React.CSSProperties}>
      <div className="tool-card__top">
        <span className="tool-card__icon">{icon}</span>
        <span className={`status ${active ? 'status--active' : ''}`}>
          <i /> {active ? 'Activo' : 'Disponible'}
        </span>
      </div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {children}
      <button className="tool-card__action" type="button" onClick={onAction}>
        {action}
        <span aria-hidden="true">→</span>
      </button>
    </article>
  );
}
