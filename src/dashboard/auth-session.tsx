import { createContext, useContext, type ReactNode } from "react";
import type { AdminUser } from "./models";

interface SessionValue {
  user: AdminUser;
  updateUser: (user: AdminUser) => void;
}

interface SessionProviderProps extends SessionValue {
  children: ReactNode;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({
  user,
  updateUser,
  children,
}: SessionProviderProps) {
  return (
    <SessionContext.Provider value={{ user, updateUser }}>
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (value === null) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return value;
}
