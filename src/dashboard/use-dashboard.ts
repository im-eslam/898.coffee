import { useEffect, useState } from "react";
import { setLocale } from "@/shared/i18n";
import { reportError } from "@/shared/logging";
import { useLocation } from "@/shared/router";
import { getAuthError, logout, me, onSessionExpired } from "./api";
import type { AdminUser, Session } from "./models";
import { DEFAULT_TAB, findTab } from "./routes";

export function useDashboard() {
  const [path, navigate] = useLocation();
  const [session, setSession] = useState<Session>({ status: "checking" });
  const [attempt, setAttempt] = useState(0);

  function signIn(user: AdminUser) {
    setLocale(user.language);
    setSession({ status: "signed-in", user });
  }

  // Check the session on mount, and again each time the user presses retry.
  useEffect(() => {
    let active = true; // ignore results from a check that was superseded

    me()
      .then((user) => {
        if (active) signIn(user);
      })
      .catch((cause: unknown) => {
        if (!active) return;

        if (getAuthError(cause) === "unauthorized") {
          setSession({ status: "signed-out" });
          return;
        }

        reportError(cause, { feature: "dashboard", operation: "session check" });
        setSession({ status: "error" });
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  // Session expired while the user was working: send them back to login.
  useEffect(() => {
    return onSessionExpired(() => setSession({ status: "signed-out" }));
  }, []);

  function retry() {
    setSession({ status: "checking" });
    setAttempt((current) => current + 1);
  }

  const isKnownPath = findTab(path) !== undefined;
  useEffect(() => {
    if (session.status === "signed-in" && !isKnownPath) {
      navigate(DEFAULT_TAB.href, { replace: true });
    }
  }, [session.status, isKnownPath, navigate]);

  async function signOut() {
    try {
      await logout();
    } catch (cause) {
      if (getAuthError(cause) !== "unauthorized") {
        reportError(cause, { feature: "dashboard", operation: "logout" });
      }
    }
    setSession({ status: "signed-out" });
  }

  return { session, path, signIn, signOut, retry };
}
