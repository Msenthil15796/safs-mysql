// App Imports
//import params from "../../../setup/config/params";
import { authCheck } from "../../../setup/helpers/utils";
import { logCreate } from "../../log/mutation";
//import OrderItem from '../../orderItem/model'
import Contacts from "../model";
//import User from '../../user/model'

// Order get by user
export default async function listContact({ auth, translate }) {
  if (authCheck(auth)) {
    console.log("list");
    try {
      console.log("inside");

      const userId = auth.user.id;
      console.log(userId);

      const contact = await Contacts.findAll({ where: { userId } });
      //console.log(contact);
      return {
        data: [contact]
      };
    } catch (error) {
      await logCreate({
        params: {
          payload: { method: "listContact", message: error.message }
        },
        auth
      });

      throw new Error(translate.t("common.messages.error.server"));
    }
  }

  throw new Error(translate.t("common.messages.error.unauthorized"));
}
