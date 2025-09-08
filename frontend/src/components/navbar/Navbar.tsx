import {Link} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faUser} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <header className="w-full flex items-center gap-4 p-4 bg-background-secondary shadow-lg">
      <Link to="/" className="flex items-center justify-center gap-2 font-bold text-2xl hover-text-glow">
        <FontAwesomeIcon icon={faCoins}/>
        <span>Crypto App</span>
      </Link>

      <nav className="flex items-center gap-4 mx-auto">
        <Link to="/" className="hover-text-glow">Home</Link>
        <Link to="/portfolio" className="hover-text-glow">Portfolio</Link>
      </nav>

      <div>
        {/*User Profile Icon*/}
        <Link to="/profile">
          <div
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xl p-2 text-background-secondary cursor-pointer hover-glow">
            <FontAwesomeIcon icon={faUser}/>
          </div>
        </Link>

      </div>

    </header>
  )
}