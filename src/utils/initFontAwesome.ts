import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCog,
  faLink,
  faPowerOff,
  faUser,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

function initFontAwesome() {
  library.add(faLink);
  library.add(faUser);
  library.add(faPowerOff);
  library.add(faTrashAlt);
  library.add(faCog);
}

export default initFontAwesome;
