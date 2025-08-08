import { Types } from "mongoose";

export interface ITourType {
    name: string
}
export interface ITour {
    title: string;
    slug: string;
    description?: string;
    Images?: string[];
    departureLocation?: string;
    arrivalLocation?: string;
    location?: string;
    costFrom?: number;
    startDate?: Date;
    endDate?: Date;
    included?: string[];
    excluded?: string[];
    amenities?: string[];
    tourPlan?: string[];
    maxGuest?: number;
    minAge?: number;
    division: Types.ObjectId;
    tourType: Types.ObjectId;
    deletedImage: string[];


}