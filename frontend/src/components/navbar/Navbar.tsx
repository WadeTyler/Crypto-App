import {Link, useLocation} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faRightToBracket, faUser} from "@fortawesome/free-solid-svg-icons";
import {useQuery} from "@tanstack/react-query";
import {getCurrentUser} from "../../features/auth/auth.api.ts";

export default function Navbar() {

  const {data: authUser} = useQuery({
    queryKey: ['authUser'],
    queryFn: getCurrentUser
  });

  const location = useLocation();

  return (
    <header className="w-full bg-background-secondary p-4 fixed top-0 left-0 z-[1000] h-16 flex items-center justify-center border-b-accent border-b">
      <div className="container mx-auto flex items-center gap-4 justify-between">
        <Link to="/" className="flex items-center justify-center gap-2 font-bold md:text-2xl">
          <FontAwesomeIcon icon={faCoins} />
          <span>Crypto App</span>
        </Link>

        <nav className="flex items-center gap-4 mx-auto md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link to="/" className={`hover-text-glow ${location.pathname === "/" && 'text-glow'}`}>Home</Link>
          <Link to="/portfolio" className={`hover-text-glow ${location.pathname === "/portfolio" && 'text-glow'}`}>Portfolio</Link>
          {!authUser && (
            <Link to="/auth" className={`hover-text-glow ${location.pathname === "/auth" && 'text-glow'} md:hidden`}>Login</Link>
          )}
        </nav>

        <div>
          {authUser && (
            <Link to="/profile">
              <div
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xl p-2 text-background-secondary cursor-pointer hover-glow">
                <FontAwesomeIcon icon={faUser}/>
              </div>
            </Link>
          )}
          {!authUser && (
            <Link to={"/auth"} className="btn-1 hover-glow md:flex! hidden!">
              <FontAwesomeIcon icon={faRightToBracket} />
              <span>Login / Register</span>
            </Link>
          )}
        </div>
      </div>

    </header>
  )
}