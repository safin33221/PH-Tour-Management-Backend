export interface IErrorSource {
    path: string,
    message: string
}
export interface TGenericErrorResponse {
    statusCode: number,
    message: string,
    errorSources?: IErrorSource[]
}