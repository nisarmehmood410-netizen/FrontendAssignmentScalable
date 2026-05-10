import { NavLink, Route, Routes, Navigate, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ImageDetailPage from "./pages/ImageDetailPage";
import CreatorDashboardPage from "./pages/CreatorDashboardPage";
import AuthPage from "./pages/AuthPage";
import { Bell, Image, Menu, X } from "lucide-react";
import { fetchNotifications } from "./services/notificationService";
import Button from "./components/Button";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        return null;
      }
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    function syncAuthState() {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser || storedUser === "undefined" || storedUser === "null") {
          setUser(null);
          return;
        }
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("auth-change", syncAuthState);
    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("auth-change", syncAuthState);
    };
  }, []);

  useEffect(() => {
    if (!showNotifications) return;

    async function loadNotifications() {
      setLoadingNotif(true);
      try {
        const data = await fetchNotifications();
        setNotifications(data || []);
      } catch {
        console.error("Failed to load notifications");
      } finally {
        setLoadingNotif(false);
      }
    }

    loadNotifications();
  }, [showNotifications]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [user]);

  return (
    <div className="app-root">
      <div className="app-backdrop" aria-hidden />
      <header className="app-header">
        <div className="app-header-bar">
          <Link to="/" className="app-brand">
            <span className="app-brand-mark" aria-hidden>
              <Image size={22} strokeWidth={1.75} />
            </span>
            <span className="app-brand-name">Etherframe</span>
            <span className="app-brand-tag">gallery</span>
          </Link>

          <nav
            id="primary-navigation"
            className={`app-nav ${mobileNavOpen ? "is-open" : ""}`}
            aria-label="Primary"
          >
            <NavLink
              end
              to="/"
              className={({ isActive }) =>
                `app-nav-link${isActive ? " is-active" : ""}`
              }
            >
              Explore
            </NavLink>

            {user?.role === "creator" && (
              <NavLink
                to="/creator"
                className={({ isActive }) =>
                  `app-nav-link${isActive ? " is-active" : ""}`
                }
              >
                Studio
              </NavLink>
            )}

            {!user ? (
              <NavLink
                to="/auth"
                className={({ isActive }) =>
                  `app-nav-link app-nav-accent${isActive ? " is-active" : ""}`
                }
              >
                Sign in
              </NavLink>
            ) : (
              <>
                <div className="app-nav-divider mobile-only" aria-hidden />
                <button
                  type="button"
                  className="app-nav-link ghost mobile-only"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                    window.dispatchEvent(new Event("auth-change"));
                  }}
                >
                  Sign out
                </button>
              </>
            )}
          </nav>

          <div className="app-header-tools">
            {user && (
              <>
                <div className="notif-scope">
                  <Button
                    type="button"
                    variant="ghost"
                    className="notif-trigger"
                    onClick={() => setShowNotifications((p) => !p)}
                  >
                    <span className="notif-trigger-label">Alerts</span>
                    <Bell size={18} strokeWidth={2} aria-hidden />
                    {notifications.length > 0 ? (
                      <span className="notif-badge">{notifications.length}</span>
                    ) : null}
                  </Button>

                  {showNotifications ? (
                    <div className="notif-drawer card-elevated" role="dialog">
                      <div className="notif-drawer-head">
                        <strong>Alerts</strong>
                        <button
                          type="button"
                          className="icon-chip"
                          onClick={() => setShowNotifications(false)}
                        >
                          <X size={16} aria-hidden />
                          <span className="sr-only">Close alerts</span>
                        </button>
                      </div>
                      <div className="notif-drawer-body">
                        {loadingNotif ? (
                          <p className="muted">Loading.</p>
                        ) : notifications.length > 0 ? (
                          notifications.map((n) => (
                            <p key={n.id || n._id} className="notif-row">
                              {n.message || n.text || "New notification"}
                            </p>
                          ))
                        ) : (
                          <p className="muted">You are caught up.</p>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="user-chip desktop-inline">
                  <span>{user.username || "Signed in"}</span>
                  <button
                    type="button"
                    className="text-link muted"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      setUser(null);
                      window.dispatchEvent(new Event("auth-change"));
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
            <button
              type="button"
              className="burger"
              aria-expanded={mobileNavOpen}
              aria-controls="primary-navigation"
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              {mobileNavOpen ? (
                <>
                  <X size={22} aria-hidden />
                  <span className="sr-only">Close menu</span>
                </>
              ) : (
                <>
                  <Menu size={22} aria-hidden />
                  <span className="sr-only">Open menu</span>
                </>
              )}
            </button>
          </div>
        </div>

      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/images/:imageId" element={<ImageDetailPage />} />
          <Route
            path="/creator"
            element={
              user?.role === "creator" ? (
                <CreatorDashboardPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/auth"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <AuthPage
                  onAuthSuccess={(nextUser) => {
                    setUser(nextUser);
                    window.dispatchEvent(new Event("auth-change"));
                  }}
                />
              )
            }
          />
        </Routes>
      </main>

      <footer className="app-footer">
        <span>Etherframe</span>
        <span className="dot" aria-hidden />
        <span className="muted">Visual stories platform</span>
      </footer>
    </div>
  );
}

export default App;
