import { Brand } from "./brand";
import { LogoutButton } from "./logout-button";

interface MobileHeaderProps {
  pending: boolean;
  onLogout: () => void;
}

export function MobileHeader({ pending, onLogout }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex min-h-14 items-center justify-between border-b border-slate-200 bg-white px-4 pt-[env(safe-area-inset-top)] md:hidden">
      <Brand />
      <LogoutButton pending={pending} onPress={onLogout} variant="compact" />
    </header>
  );
}
