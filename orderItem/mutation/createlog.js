import  {authCheck} from '../../../setup/helpers/utils'
import {logCreate} from '../../log/mutation'
import Contact from '../../user/model'
import Visitlog from '../model'


export default async function addLog({
    params:{

        contactId,
        name,
        village,
        district,
        contactNo,
        nextDate,
        reason,
        remarks,
        status,
        // visitlogDto:{
        //     contactId,
        //     nextDate,
        //     reason,
        //     remarks,
        //     status

        // }
    },auth,translate
}){
    if(authCheck(auth)){
        console.log("ready")
        try{
            const contactData={
                userId:auth.user._id,
                contactId,
                name,
                village,
                district,
                contactNo,
                nextDate,
                reason,
                remarks,
                status,
                // visitlogDto:{
                //      contactId,
                //      nextDate,
                //      reason,
                //      remarks,
                //      status

                // }
            }
           // const contact =await Contact.create(contactData);
            const visitlog=await Visitlog.create(contactData)

            console.log('created')
            return{
                data:[visitlog],
                message:"log created successfully"
            };

        }catch(error){
            console.error(error)
            await logCreate({params:{payload:{method:"addLog",message:error.message}},auth});
            throw new Error(translate.t("common.messages.error.server"));
        }
    }
    throw new Error(translate.t("common.messages.error.unauthorized"));
}