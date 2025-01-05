import express, { Request, Response, NextFunction } from "express";
import Res from "../utils/response.api";


const serverKey = (req: Request, res: Response, next: NextFunction) => {
    
    const keyServer = req.headers["x-key-server"];
    
    if (keyServer !== process.env.KEY_SERVER) {
        return Res(res, 403, "Forbidden", "Invalid key server");
    }

    next();
}

export default serverKey