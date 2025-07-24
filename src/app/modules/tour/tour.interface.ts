import { Types } from "mongoose";

export interface ITour {
    title: string;
    slug: string;
    description?: string;
    Images?: string[];
    location?: string[];
    costFrom?: string;
    startDate?: Date;
    endDate?: Date;
    included?: string[];
    excluded?: string[];
    amenities?: string[];
    tourPlan?: string;
    maxGuest?: number;
    minAge?: number;
    division: Types.ObjectId;
    tourType: Types.ObjectId;


}