import prisma from "../../config/prisma.config";
import handleError from "../../utils/handleError";
import { iAddSaller, iSallerAddress, iUpdateSaller } from "../../types/saller";


export default class SallerService {
    static async getSaller(sallerId? : string){ 
        try {
            if (!sallerId) {
                const saller = await prisma.saller.findMany()
                return saller
            } else {
                const saller = await prisma.saller.findUnique({
                    where: {
                        id : sallerId
                    }
                })
    
                return saller
            }
        } catch (error : unknown) {
            handleError(error)
        }
    }

    static async addSaller(sallerData : iAddSaller){
        try {
            const saller = await prisma.saller.create({
                data : sallerData
            })
            return saller
        } catch (error : unknown) {
            handleError(error)
        }

    }

    static async addressSaller(sallerData: iSallerAddress){
        try {
            const address = await prisma.sallerAddress.create({
                data : sallerData
            })

            return address

        } catch (error : unknown) {
            handleError(error)
        }

    }

    static async updateSaller(sallerData : iUpdateSaller){
        try {
            const saller = await prisma.saller.update({
                where : {
                    userId : sallerData.userId
                },
                data : sallerData
            })
            return saller
        } catch (error : unknown) {
            handleError(error)
        }
    }

    static async deleteSaller(sallerId : string){
        try {
            const saller = await prisma.saller.delete({
                where : {
                    id : sallerId
                }
            })
            return saller
        } catch (error : unknown) {
            handleError(error)
        }
    }
}
