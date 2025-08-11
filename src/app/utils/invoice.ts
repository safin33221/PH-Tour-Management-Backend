/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from 'pdfkit';
import AppError from '../errorHelpers/AppError';

export interface IInvoiceData {
    transactionID: string;
    customer: string
    bookingDate: Date;
    tourTitle: string;
    guestCount: number
    totalAmount: number
}
export const generatePDF = async (invoiceData: IInvoiceData): Promise<Buffer<ArrayBufferLike>> => {
    try {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: "A4", margin: 50 })
            const buffer: Uint8Array[] = [];
            doc.on("data", (chunk) => buffer.push(chunk))
            doc.on("end", () => resolve(Buffer.concat(buffer)))
            doc.on("error", (err) => reject(err))

            //PDF Content
            doc.fontSize(20).text("Invoice", { align: 'center' })
            doc.moveDown()
            doc.fontSize(14).text(`TransactionId : ${invoiceData.transactionID}`)
            doc.fontSize(14).text(`Booking Date : ${invoiceData.bookingDate}`)
            doc.fontSize(14).text(`Customer : ${invoiceData.customer}`)
            doc.moveDown()
            doc.fontSize(14).text(`Tour : ${invoiceData.tourTitle}`)
            doc.fontSize(14).text(`Guest: ${invoiceData.guestCount}`)
            doc.fontSize(14).text(`Total Amount: ${invoiceData.totalAmount}`)
            doc.moveDown()

            doc.fontSize(20).text("Thank you for booking with ur", { align: 'center' })

            doc.end()


        })
    } catch (error: any) {
        console.log("pdf generation error", error);
        throw new AppError(401, `PDF generation Error : ${error.message}`)
    }
}