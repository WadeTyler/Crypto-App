import {LoadingMd} from "../components/LoadingSpinner.tsx";

export default function LoadingPage() {
  return (
    <div className="page">
      <div className="container mx-auto flex items-center justify-center">
        <h1 aria-readonly className="hidden">Loading...</h1>
        <LoadingMd />
      </div>
    </div>
  )
}