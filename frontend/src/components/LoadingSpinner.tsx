import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function LoadingMd() {
  return (
    <FontAwesomeIcon icon={faSpinner} className="animate-spin" size="3x" />
  )}