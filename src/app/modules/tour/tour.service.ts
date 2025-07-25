import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title })
    if (existingTour) {
        throw new Error("A Tour with This title already exist")
    }

    const baseSlug = payload.title?.toLowerCase().split(" ").join("-")
    let slug = `${baseSlug}-division`
    let counter = 0
    while (await Tour.exists({ slug })) {
        slug = `${slug}-${counter++}`
    }

    payload.slug = slug
    const tour = await Tour.create(payload)
    return tour
}


const getAllTour = async () => {
    const tours = await Tour.find({})
    const totalTours = await Tour.countDocuments()
    return {
        tours,
        meta: {
            total: totalTours
        }
    }
}


const updateTour = async (id: string, payload: Partial<ITour>) => {
    const isExistingTour = await Tour.findById(id)
    if (!isExistingTour) {
        throw new Error("Tour not found")

    }
    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    return updatedTour

}

const deleteTour = async (id: string) => {
    await Tour.findByIdAndDelete(id)
    return null
}


export const tourService = {
    createTour,
    getAllTour,
    updateTour,
    deleteTour
}