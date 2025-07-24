import AppError from "../../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
    //Check Existing Division
    const isExistingDivision = await Division.findOne({ name: payload.name })
    if (isExistingDivision) {
        throw new AppError(400, "A division with this name already exist")
    }

    const division = await Division.create(payload)
    return division

}


export const divisionService = {
    createDivision
}