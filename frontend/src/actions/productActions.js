import axios from 'axios';

import {
    ALL_PRODUCTS_REQUEST, 
    ALL_PRODUCTS_SUCCESS, 
    ALL_PRODUCTS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    CLEAR_ERRORS,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL
} from "../constants/productConstants";

export const getProducts = (keyword = "", page = 1, price = [1, 10000], category, rating = 0) => async (dispatch) => {
    try {
        dispatch({
            type: ALL_PRODUCTS_REQUEST
        });
        let link = `/api/v1/products?keyword=${keyword.trim()}&page=${page}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${rating}`;

        if(category) {
            link += `&category=${category}`;
        }

        console.log(link);
        const {data} = await axios.get(link);
        
        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data
        });
    } catch(error) {
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response.data.message
        });
    }
} 

export const getProductDetails = (productID) => async (dispatch) => {
    try {

        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/v1/products/${productID}`);
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        });

    } catch (error) {
        console.log(error);
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const newReview = (reviewData, productID) => async (dispatch) => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const { data } = await axios.post(`/api/v1/products/${productID}`, reviewData, config);
        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        console.log(error);
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message
        });
    }
}

export const clearErrors = () => async(dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
}