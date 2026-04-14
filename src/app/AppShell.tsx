import type { PropsWithChildren } from "react";
import { navigationItems } from "./navigation";
import type { AppView } from "../types";

interface AppShellProps extends PropsWithChildren {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export function AppShell({ currentView, onNavigate, children }: AppShellProps) {
  const currentItem = navigationItems.find((item) => item.id === currentView);

  return (
    <div className="shell-layout">
      <aside className="shell-sidebar">
        <div className="rail-brand" aria-label="Draft Studio home">
          <div className="rail-brand-mark">DS</div>
          <span className="rail-brand-label">Draft Studio</span>
        </div>

        <nav className="shell-nav" aria-label="Primary">
          {navigationItems.map((item) => {
            const isActive = item.id === currentView;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? "nav-item-active" : ""}`}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="nav-item-indicator">
                  <Icon className="nav-item-icon" aria-hidden="true" strokeWidth={2.1} />
                </span>
                <strong>{item.label}</strong>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="shell-main">
        <header className="shell-header">
          <div>
            <p className="eyebrow">Current View</p>
            <h2>{currentItem?.label ?? "Workspace"}</h2>
          </div>
          <p className="shell-copy">{currentItem?.description}</p>
        </header>

        <div className="shell-content">{children}</div>
      </div>
    </div>
  );
}
