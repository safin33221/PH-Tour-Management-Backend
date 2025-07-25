import AppError from "../../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
    //Check Existing Division
    const isExistingDivision = await Division.findOne({ name: payload.name })
    if (isExistingDivision) {
        throw new AppError(400, "A division with this name already exist")
    }
    const baseSlug = payload.name?.toLowerCase().split(" ").join("-")
    let slug = `${baseSlug}-division`
    let counter = 0
    while (await Division.exists({ slug })) {
        slug = `${slug}-${counter++}`
    }
    payload.slug = slug

    const division = await Division.create(payload)
    return division

}

const getAllDivision = async () => {
    const division = await Division.find({})
    const totalDivision = await Division.countDocuments()
    return {
        data: division,
        meta: {
            total: totalDivision
        }
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

    if (payload.name) {
        const baseSlug = payload.name?.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}-division`
        let counter = 0
        while (await Division.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }
        payload.slug = slug
    }

    const updateDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
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
    deleteDivision

}