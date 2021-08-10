import axios from 'axios';
import { ADD_TO_CART, CLEAR_CART, PAYMENT_FAIL, PAYMENT_REQUEST, PAYMENT_SUCCESS, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO } from '../constants/cartConstants';

export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/products/${id}`);
    dispatch({
        type: ADD_TO_CART,
        payload: {
            productID: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity
        }
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export const removeItemFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
}

export const clearCart = () => async (dispatch) => {
    dispatch({
        type: CLEAR_CART
    });
    localStorage.removeItem("cartItems");
}

export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    });
    localStorage.setItem("shippingInfo", JSON.stringify(data));
}

export const processPayment = (paymentData, stripe, elements, CardNumberElement, cardHolderName, email) => async (dispatch) => {
    let response;
    dispatch({
        type: PAYMENT_REQUEST
    });
    
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        response = await axios.post('/api/v1/payment/process', paymentData, config);
        const clientSecret = response.data.client_secret;
        
        if(!stripe || !elements) {
            return;
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardNumberElement),
                billing_details: {
                    name: cardHolderName,
                    email: email
                }
            }
        });

        if(result.error) {
            dispatch({
                type: PAYMENT_FAIL,
                payload: result.error.message
            });
        } else if(result.paymentIntent.status === "succeeded") {
            dispatch({
                type: PAYMENT_SUCCESS,
                payload: result
            });
        } else {
            dispatch({
                type: PAYMENT_FAIL,
                payload: "There is some issue in processing payment"
            });   
        }
    } catch (error) {
        console.error(error);
        dispatch({
            type: PAYMENT_FAIL,
            payload: error.response.data.message
        });
    }
}