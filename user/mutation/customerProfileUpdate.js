// App Imports
import User from '../model'

// Customer Details update
export default async function customerProfileUpdate({ params: { _id, name, email, image, slug, gender, mobile, dateOfBirth, isVerified, communityId }, auth, translate }) {
  const set = { _id, name, email, image, slug, gender, mobile, dateOfBirth, isVerified, communityId }

  // Update
  try {

    const data = await User.updateOne({ _id }, { $set: set })
    return data

  } catch (error) {
    console.log(error)
  }
}