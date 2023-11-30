import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
// import User from "../models/user";

dotenv.config()

export const SECRET_KEY: Secret = process.env.JWT_SECRET_KEY || 'your-secret-key';

export const generateOtp = function (): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};

//GENERATE TOKEN
export const generateToken = function (payload: object = {}): string {
    const token =  jwt.sign(payload, SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
        });
    return token;
};

//VERIFY GENERATED OTP
// export const verifyOtp = async function (email: any, otp: string,): Promise<any> {
//     let existOtp = await User.findOne({
//         email,
//         otp,
//     });
//     const currentDate = new Date();
//     if (!existOtp || existOtp.otpExpiration! < currentDate) {
//         return null;
//     }
//     return email;
// };