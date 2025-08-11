import { Types } from "mongoose";
import { ITour } from "../tour/tour.interface";

export enum BOOKING_STATUS {
    PENDING = "PENDING",
    CANCEL = "CANCEL",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export interface IBooking {
    user: Types.ObjectId,
    tour: Types.ObjectId | ITour,
    payment?: Types.ObjectId,
    guestCount: number,
    status: BOOKING_STATUS,
    createdAt?:Date


}