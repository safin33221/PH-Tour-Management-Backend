import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { divisionSearchAbleFields } from "./division.constant";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {

    const isExistingDivision = await Division.findOne({ name: payload.name })
    if (isExistingDivision) {
        throw new AppError(400, "A division with this name already exist")
    }


    const division = await Division.create(payload)
    return division

}

// const getAllDivision = async () => {
//     const division = await Division.find({})
//     const totalDivision = await Division.countDocuments()
//     return {
//         data: division,
//         meta: { 
//             total: totalDivision
//         }
//     }
// }
const getAllDivision = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Division.find(), query)

    const division = await queryBuilder
        .search(divisionSearchAbleFields)
        .fields()
        .filter()
        .sort()

    const [data, meta] = await Promise.all([
        division.build(),
        queryBuilder.getMeta()
    ])
    return {
        data,
        meta
    }
}



const getSingleDivision = async (slug: string) => {

    const division = await Division.findOne({ slug })

    return {
        data: division,

    }
}

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
    const existingDivision = await Division.findById(id)
    if (!existingDivision) {
        throw new Error("Division Not Found")
    }



    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id: { $ne: id }
    })
    if (duplicateDivision) {
        throw new Error("A division With this name already exist")
    }
    const updateDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    
    if (payload.thumbnail && existingDivision.thumbnail) {
        await deleteImageFromCloudinary(existingDivision.thumbnail)
    }
    return updateDivision
}

const deleteDivision = async (id: string) => {
    await Division.findByIdAndDelete(id)
    return null
}


export const divisionService = {
    createDivision,
    getAllDivision,
    updateDivision,
    deleteDivision,
    getSingleDivision

}