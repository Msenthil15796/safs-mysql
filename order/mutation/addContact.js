import { authCheck } from "../../../setup/helpers/utils";
//import params from '../../../setup/config/params'
//import {logCreate} from '../../log/mutation'
import Contacts from "../../order/model";
//import Visitlog from '../../orderItem/model'

export default async function addContact({
  params: {
    id,
    name,
    village,
    district,
    contactNo,
    type,
    date,
    crop,
    fieldSize,
    latlang,
    nextDate,
    reason,
    remarks,
    status
    // visitlogDto:{
    //     contactId,
    //     nextDate,
    //     reason,
    //     remarks,
    //     status

    // }
  },
  auth,
  translate
}) {
 if (authCheck(auth)) {
      // console.log(auth)
    console.log("ready");
    try {
      const contactData = {
        id,
        userId: auth.user.id,
        name,
        village,
        district,
        contactNo,
        type,
        date,
        crop,
        fieldSize,
        latlang,
        nextDate,
        reason,
        remarks,
        status
        // visitlogDto:{
        //      contactId,
        //      nextDate,
        //      reason,
        //      remarks,
        //      status

        // }
      };

      const errHandler = err => {
        console.log("Error:" + err);
      };

      const contact = await Contacts.create(contactData).catch(errHandler);
      

     
      return {
        data: contact,
        message: "contact created successfully"
      };
    } catch (error) {
      console.error(error);
      await logCreate({
        params: { payload: { method: "addContact", message: error.message } },
        auth
      });
      throw new Error(translate.t("common.messages.error.server"));
    }
  }
  throw new Error(translate.t("common.messages.error.unauthorized"));
}
