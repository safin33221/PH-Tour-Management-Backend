/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
export enum PAYMENT_STATUS {
    PAID = "PAID",
    UNPAID = "UNPAID",
    CANCEL = "CANCEL",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",

}
export interface IPayment {
    booking: Types.ObjectId
    transactionId: string
    amount: number
    paymentGateWayData?: any
    invoiceURL: string
    status?: PAYMENT_STATUS
}