import express, { Request, Response, Router } from "express";
import Res from "../../utils/response.api";
import  AuthService from "./auth.service";
import { iUserRegister, iUserLogin } from "../../types/user";
const auth : Router = express.Router();


auth.post("/auth/login", async(req: Request, res: Response) => {
    const {email, password} : iUserLogin  = req.body;

    if (!email || !password) {
        return Res(res, 400, "Bad Request", "Email and password are required");
    }
    try {
        const userLogin = await AuthService.login({email, password}); 

        if (userLogin?.error) {
            return Res(res, 401, "Unauthorized", userLogin.error);
        }
        
        return Res(res, 200, "Success",null,
            {"username" : userLogin?.username}, userLogin?.token);

    } catch (error : any) {
        return Res(res, error.status, error.message, 'failed login');
    }
})

auth.post("/auth/register", async(req :Request, res : Response) => {
    const {name, username, email, password} : iUserRegister = req.body



    if (!name || !username || !email || !password) {
        return Res(res, 400,"Bad Request", "Field name, username , email, password are Required")
    }
    try {
        const addNewUser = await AuthService.createNewUser({name, username, email, password})

        
        return Res(res, 200, "Success", null, addNewUser?.userData, addNewUser?.token)
        

    } catch (error: any) {
        console.log(error)
        return Res(res, error.status, error.message, 'faied register')
    }
})

export default auth