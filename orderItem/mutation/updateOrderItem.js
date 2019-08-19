// App Imports
import {authCheck} from '../../../setup/helpers/utils'
import Visitlog from '../model'
import visitlogDto from '../../order/model'
import { logCreate } from '../../log/mutation';

// updateOrderDetails
export default async function visitlogUpdate({ params: { contactId, nextDate,reason,status,remarks }, auth, translate }) {
  // const quantity = orderItems[editId].quantity
  // const _id = orderItems[editId]._id
  // const amount = orderItems[editId].amount
  // const amountTotal = detail.order.amountTotal
  if(authCheck(auth)){
  console.log('ready')

  const history=await Visitlog.findById({contactId})

  const set = { nextDate,reason,status,remarks }

  // Update
  try {
    const data =
    
    
    
    
  await Visitlog.updateOne({ contactId }, { $set: set })
                 await visitlogDto.create({contactId }, { $set: { set } })
    return{
      data,
      message:"vistlog updated successfully"
    } 
  } catch (error) {
    console.error(error)
    await logCreate({params:{payload:{method:'updateLog',message:error.message}},auth})
    throw new Error (translate.t('common.messages.error.server'))
  }
}
throw new Error (translate.t('common.messages.error.unauthorized'))
}
