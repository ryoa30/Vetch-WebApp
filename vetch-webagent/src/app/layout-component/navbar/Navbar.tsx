import { NavbarDesktop } from "./login-navbar-web";
import { NavbarDesktop as NavbarDesktopLogin } from "./navbar-after-login-web";
import { NavbarMobile } from "./login-navbar-mobile";

type MinimalSession = {
  isAuthenticated: boolean;
  user: { id: string; role: string; fullName: string; email: string } | null;
};

export function Navbar({ session }: { session: MinimalSession }) {
  const isLoggedIn = session?.isAuthenticated;
  return (
    <>
      {isLoggedIn ? <NavbarDesktopLogin /> : <NavbarDesktop />}
      <NavbarMobile />
    </>
  );
}

export default Navbar;
