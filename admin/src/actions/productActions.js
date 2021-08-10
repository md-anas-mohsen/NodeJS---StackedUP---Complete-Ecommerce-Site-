/* eslint-disable prettier/prettier */
import axios from 'axios';

import {
    ALL_PRODUCTS_REQUEST, 
    ALL_PRODUCTS_SUCCESS, 
    ALL_PRODUCTS_FAIL,
    PRODUCT_DETAILS_REQUEST, 
    PRODUCT_DETAILS_SUCCESS, 
    PRODUCT_DETAILS_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    CLEAR_ERRORS,
} from "../constants/productConstants";

export const getProducts = () => async (dispatch) => {
    try {
        dispatch({
            type: ALL_PRODUCTS_REQUEST
        });
        const { data } = await axios.get("/api/v1/admin/products");
        
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

export const newProduct = (productData) => async (dispatch) => {
    try {
        dispatch({
            type: NEW_PRODUCT_REQUEST
        });

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const { data } = await axios.post("/api/v1/admin/products", productData, config);
        
        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data
        });
    } catch(error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message
        });
    }
}

export const updateProduct = (productID, productData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_PRODUCT_REQUEST
        });

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const { data } = await axios.put(`/api/v1/admin/products/${productID}`, productData, config);
        
        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data
        });
    } catch(error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message
        });
    }
}

export const deleteProduct = (productID) => async (dispatch) => {
    try {
        dispatch({
            type: DELETE_PRODUCT_REQUEST
        });

        const { data } = await axios.delete(`/api/v1/admin/products/${productID}`);
        
        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success
        });
    } catch(error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response.data.message
        });
    }
}

export const deleteReview = (productID, reviewID) => async (dispatch) => {
    try {
        dispatch({
            type: DELETE_REVIEW_REQUEST
        });

        const { data } = await axios.delete(
            `/api/v1/reviews?productId=${productID}&reviewId=${reviewID}`
        );
        
        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success
        });
    } catch(error) {
        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response.data.message
        });
    }
}

export const clearErrors = () => async(dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
}