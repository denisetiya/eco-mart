import { Router } from "express"
import SallerService from "./saller.service"
import Res from "../../utils/response.api"
const saller: Router = Router()

saller.get("/sallers", (req, res) => {
    try {
        const saller = SallerService.getSaller()

        if (!saller) {
            return Res(res, 404, "Not Found", "Saller not found")
        }

        return Res(res, 200, "Success", null, saller)

    } catch (error:any) {
        console.log(error)
        return Res(res, error.status,'failed get products', error.message );
    }
})