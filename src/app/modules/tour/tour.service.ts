/* eslint-disable @typescript-eslint/no-unused-vars */
import { tourSearchAbleFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { QueryBuilder } from "../../utils/queryBuilder";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";





const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title })

    if (existingTour) {
        throw new Error("A Tour with This title already exist")
    }
    const tour = await Tour.create(payload)
    return tour
}


const getAllTour = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Tour.find(), query)


    const tours = await queryBuilder
        .search(tourSearchAbleFields)
        .filter()
        .sort()
        .fields()
        .paginate()



    // const meta = await queryBuilder.getMeta()
    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])
    return {
        data,
        meta
    }
}



const getSingleTour = async (slug: string) => {
    const tour = await Tour.findOne({ slug });
    return {
        data: tour,
    }
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
    const isExistingTour = await Tour.findById(id)
    if (!isExistingTour) {
        throw new Error("Tour not found")
    }

    if (payload.Images && payload.Images.length && isExistingTour.Images && isExistingTour.Images.length) {
        payload.Images = [...payload.Images, ...isExistingTour.Images]
    }
    if (payload.deletedImage && payload.deletedImage.length > 0 && isExistingTour.Images && isExistingTour.Images.length > 0) {
        const restDBImage = isExistingTour.Images.filter(imageUrl => !payload.deletedImage?.includes(imageUrl))

        const updatedPayloadImage = (payload.Images || [])
            .filter(imageUrl => !payload.deletedImage?.includes(imageUrl))
            .filter(imageUrl => !restDBImage?.includes(imageUrl))

        payload.Images = [...restDBImage, ...updatedPayloadImage]
    }
    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true, runValidators: true })


    if (payload.deletedImage && payload.deletedImage.length > 0 && isExistingTour.Images && isExistingTour.Images.length > 0) {
        await Promise.all(payload.deletedImage.map(url => deleteImageFromCloudinary(url)))
    }


    return updatedTour
}

const deleteTour = async (id: string) => {
    await Tour.findByIdAndDelete(id)
    return null
}



const createTourType = async (name: ITourType) => {

    const existingTourType = await TourType.findOne({ name });
    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }
    return await TourType.create({ name });
};

const getAllTourTypes = async (query: Record<string, string>) => {
    // const queryBuilder = new QueryBuilder(TourType.find(), query)

    // const tourTypes = await queryBuilder
    //     .search(tourTypeSearchableFields)
    //     .filter()
    //     .sort()
    //     .fields()
    //     .paginate()

    // const [data, meta] = await Promise.all([
    //     tourTypes.build(),
    //     queryBuilder.getMeta()
    // ])

    // return {
    //     data,
    //     meta
    // }
};



const getSingleTourType = async (id: string) => {
    const tourType = await TourType.findById(id);
    return {
        data: tourType
    };
};
const updateTourType = async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
};
const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    return await TourType.findByIdAndDelete(id);
};

export const tourService = {
    createTour,
    getAllTour,
    updateTour,
    deleteTour,
    getSingleTour,

    getSingleTourType,
    getAllTourTypes,
    createTourType,
    updateTourType,
    deleteTourType
}