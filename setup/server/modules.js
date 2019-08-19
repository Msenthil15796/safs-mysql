// App Imports
import log from '../../modules/log'
import user from '../../modules/user'
import category from '../../modules/category'
import product from '../../modules/product'
import community from '../../modules/community'
import order from '../../modules/order'
import banner from '../../modules/banner'
import payment from '../../modules/payment'
import wallet from '../../modules/wallet'
import kyc from '../../modules/kyc'
import setting from '../../modules/setting'
import orderItem from '../../modules/orderItem';
import orderCalculation from '../../modules/orderCalculation';

// Modules
export default {
  ...log,
  ...user,
  ...category,
  ...product,
  ...community,
  ...order,
  ...banner,
  ...payment,
  ...wallet,
  ...kyc,
  ...setting,
  ...orderItem,
  ...orderCalculation
}
