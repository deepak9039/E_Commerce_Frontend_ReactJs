import React from 'react'
import axios from 'axios'

export const processPayment = async (paymentData) => {
    try {
        const response = await axios.post('/process-payment', paymentData)
        return response.data;
    } catch (error) {
        throw new Error('Payment request failed')
    }
}

export const fetchPaymentDetails = async (payload) => {
    try {
        const response = await axios.post('payment-details', payload)
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch payment details')
    }
}

export const fetchOrderDetails = async (payload) => {
    try {
        const response = await axios.post('user-order-details', payload)
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch order details')
    }
}

