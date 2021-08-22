import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  allUsersReducer,
  authReducer,
  userDetailsReducer,
  userReducer,
} from './reducers/userReducers'
import {
  bannerReducer,
  newProductReducer,
  newSlideReducer,
  productDetailsReducer,
  productReducer,
  productsReducer,
  reviewReducer,
  slideReducer,
} from './reducers/productReducer'
import { sidebarReducer } from './reducers/sidebarReducer'
import { orderDetailsReducer, orderReducer, ordersReducer } from './reducers/orderReducers'

const reducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  newProduct: newProductReducer,
  product: productReducer,
  productDetails: productDetailsReducer,
  review: reviewReducer,
  orders: ordersReducer,
  order: orderReducer,
  orderDetails: orderDetailsReducer,
  users: allUsersReducer,
  user: userReducer,
  userDetails: userDetailsReducer,
  sidebar: sidebarReducer,
  banner: bannerReducer,
  newSlide: newSlideReducer,
  slide: slideReducer,
})

const middleware = [thunk]

const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)))
export default store
