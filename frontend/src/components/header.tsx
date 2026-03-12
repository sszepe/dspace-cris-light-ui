export function Header() {
  return (
    <header className="app-header">
      <div className="header-title">
        <h1>DSpace Console</h1>
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
