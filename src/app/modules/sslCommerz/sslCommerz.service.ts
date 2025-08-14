/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { any } from "zod";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { ISLLCommerz } from "./SLLCommerz.interface";
import axios from 'axios'
import StatusCodes from "http-status-codes";
import { Payment } from "../payment/payment.model";
const SSLCommerzInit = async (payload: ISLLCommerz) => {

    try {
        const data = {
            store_id: envVars.SSL.SSL_STORE_ID,
            store_passwd: envVars.SSL.SSL_STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            ipn_url: envVars.SSL.SSL_IPN_URL,
            shipping_method: "N/A",
            product_name: "Tour", //important
            product_category: "Service", //important
            product_profile: "general", //important
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phoneNumber,
            cus_fax: "01711111111",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A",
        }

        const response = await axios({
            method: "POST",
            url: envVars.SSL.SSL_PAYMENT_API,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })

        return response.data
    } catch (error: any) {
        console.log("payment error occured", error);
        throw new AppError(StatusCodes.BAD_REQUEST, error.message)
    }
}


const validatedPayment = async (payload: any) => {
    try {
        const response = await axios({
            method: "Get",
            url: `${envVars.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVars.SSL.SSL_STORE_ID}&store_passwd=${envVars.SSL.SSL_STORE_PASS}`

        })
        console.log("ssl commerz validate api response", response.data);
        await Payment.updateOne({ transactionId: payload.tran_id }, { paymentGateWayData: response.data }, { runValidators: true })
    } catch (error: any) {
        console.log("Payment validation error");
        throw new AppError(401, `Payment validation Error : ${error.message}`)
    }
}

export const SLLService = {
    SSLCommerzInit,
    validatedPayment
}