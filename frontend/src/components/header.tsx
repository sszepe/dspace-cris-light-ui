type HeaderProps = {
  /** Application name from the active profile (e.g. "mdw FIS", "DSpace CRIS"). */
  appName?: string;
};

export function Header({ appName }: HeaderProps) {
  const title = appName ?? "DSpace Console";
  return (
    <header className="app-header">
      <div className="header-title">
        <h1>{title}</h1>
        <div className="header-sub">
          DSpace CRIS Light UI.{" "}
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </div>
      </div>

      <div className="header-meta">
        API: {import.meta.env.VITE_API_BASE_URL}
      </div>
    </header>
  );
}
