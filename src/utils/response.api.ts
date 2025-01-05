import { Response } from "express";

const Res = (
    res: Response,
    status: number,
    message: string,
    error: any = null,
    content: any = null,
    meta: any = null
) => {
    res.status(status).json({
        statusCode: status,
        message,
        ...(error && { error }), 
        ...(content && { content }),
        ...(meta && { meta }),
    });
};

export default Res;
