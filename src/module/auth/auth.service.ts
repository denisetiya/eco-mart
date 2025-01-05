import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.config';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import { iUserLogin, iUserRegister } from '../../types/user';
import handleError from '../../utils/handleError';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;


export default class AuthService {
    static async createNewUser(userData : iUserRegister) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await prisma.user.create({
                data: {
                    name: userData.name,
                    username : userData.username,
                    email: userData.email,
                    password: hashedPassword
                } 
            });
            
            if (user) {
                const token = await generateTokens(user.id, user.email)
                return {
                    token : token,
                    userData : {
                        username : user.username,
                        email : user.email
                    }
                }
            }

        } catch (error : unknown) {
            handleError(error)
        }
    }

    static async login(userData: iUserLogin) {

        try {
            
            const user = await prisma.user.findUnique({
                where: {
                    email: userData.email
                }
            });
    
            if (!user) {
                return {error : "User not found"}
            }
    
            const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    
            if (!isPasswordValid) {
                return {error : "Invalid password"}
            }
            const token = await generateTokens(user.id, user.email);
            return {
                username : user.username,
                token : token
            } 

        } catch (error : unknown) {
            handleError(error)
        }
    }
}





const generateTokens = async (userId: string, email: string) => {
    try {
        // Generate access and refresh tokens
        const accessToken = jwt.sign({ id: userId, email }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: userId, email }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({ where: { id: userId } });

        // If user doesn't exist, create a new user and store refreshToken
        if (!user) {
            return "User not found";
        }

        return { accessToken, refreshToken };

    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new Error("Error generating tokens");
    }
};
