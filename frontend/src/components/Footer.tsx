import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="w-full border-t border-accent bg-background-secondary/95 mt-16">
      <div className="container py-10 flex flex-col gap-10">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start p-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold hover-text-glow w-fit">
              <FontAwesomeIcon icon={faCoins} />
              <span>Crypto App</span>
            </Link>
            <p className="text-secondary max-w-md">
              Track coins, watch prices, and manage your portfolio with a clean, fast UI.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-wide text-secondary">Navigate</p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/" className="hover-text-glow">Home</Link>
              <Link to="/portfolio" className="hover-text-glow">Portfolio</Link>
              <Link to="/auth" className="hover-text-glow">Login</Link>
              <Link to="/profile" className="hover-text-glow">Profile</Link>
            </div>
          </nav>

        </div>

        {/* Divider */}
        <div className="h-px w-full bg-accent/30" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary p-4">
          <p>
            © {new Date().getFullYear()} Crypto App. All rights reserved.
          </p>

          <a href="https://www.coingecko.com/en/api" target="_blank">
            <img src="/coingecko-logo.avif" alt="Data Powered by CoinGecko" className="min-w-[90px] max-w-[250px]" />
          </a>

          <div className="flex items-center gap-4">
            <a href="#" className="hover-text-glow">Privacy</a>
            <a href="#" className="hover-text-glow">Terms</a>
            <a href="#" className="hover-text-glow">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}