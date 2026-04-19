import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState, type PropsWithChildren } from "react";
import { navigationItems, navigationSections } from "./navigation";
import type { AppView } from "../types";

interface AppShellProps extends PropsWithChildren {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export function AppShell({ currentView, onNavigate, children }: AppShellProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const currentItem = navigationItems.find((item) => item.id === currentView);
  const currentSection = navigationSections.find((section) =>
    section.items.some((item) => item.id === currentView),
  );

  return (
    <div className={`shell-layout ${isNavExpanded ? "shell-layout-expanded" : "shell-layout-collapsed"}`}>
      <aside className={`shell-sidebar ${isNavExpanded ? "" : "shell-sidebar-collapsed"}`}>
        <div className="rail-brand" aria-label="Draft Studio home">
          <div className="rail-brand-mark">DS</div>
          {isNavExpanded ? (
            <div className="rail-brand-copy">
              <span className="rail-brand-label">Draft Studio</span>
              <small>Operator workspace</small>
            </div>
          ) : null}
        </div>

        <nav className="shell-nav" aria-label="Primary">
          {navigationSections.map((section) => (
            <div key={section.label} className="nav-section">
              {isNavExpanded ? <p className="nav-section-label">{section.label}</p> : null}
              <div className="nav-section-items">
                {section.items.map((item) => {
                  const isActive = item.id === currentView;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`nav-item ${isActive ? "nav-item-active" : ""}`}
                      onClick={() => onNavigate(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      title={item.label}
                    >
                      <span className="nav-item-indicator">
                        <Icon className="nav-item-icon" aria-hidden="true" strokeWidth={2.1} />
                      </span>
                      <span className="nav-item-copy">
                        <strong>{item.label}</strong>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <button
          type="button"
          className="icon-button nav-toggle nav-toggle-sidebar"
          onClick={() => setIsNavExpanded((current) => !current)}
          aria-label={isNavExpanded ? "Collapse navigation" : "Expand navigation"}
          title={isNavExpanded ? "Collapse navigation" : "Expand navigation"}
        >
          {isNavExpanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </aside>

      <div className="shell-main">
        <header className="shell-header">
          <div className="shell-header-main">
            <button
              type="button"
              className="icon-button nav-toggle nav-toggle-header"
              onClick={() => setIsNavExpanded((current) => !current)}
              aria-label={isNavExpanded ? "Collapse navigation" : "Expand navigation"}
              title={isNavExpanded ? "Collapse navigation" : "Expand navigation"}
            >
              {isNavExpanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <div>
              <p className="eyebrow">{currentSection?.label ?? "Workspace"}</p>
              <h2>{currentItem?.label ?? "Workspace"}</h2>
            </div>
          </div>
          <p className="shell-copy">{currentItem?.description}</p>
        </header>

        <div className="shell-content">{children}</div>
      </div>
    </div>
  );
}
