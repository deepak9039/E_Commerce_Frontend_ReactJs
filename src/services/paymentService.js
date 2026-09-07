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


