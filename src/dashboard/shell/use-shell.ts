import { useState } from "react";

export function useShell(onLogout: () => Promise<void>) {
  const [loggingOut, setLoggingOut] = useState(false);

  async function signOut() {
    setLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setLoggingOut(false);
    }
  }

  return { loggingOut, signOut };
}
