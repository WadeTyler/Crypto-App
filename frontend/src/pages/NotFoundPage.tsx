import {Link} from "react-router";

export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="container mx-auto flex flex-col items-center justify-center gap-8">
        <h1 className="text-3xl font-semibold text-accent text-shadow-md text-shadow-accent/20 text-center text-balance">
          Sorry, we couldn't find that page.
        </h1>
        <Link to="/" className="btn-1 w-fit">
          Back Home
        </Link>
      </div>
    </div>
  )
}