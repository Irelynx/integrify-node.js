import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";
import { PreconditionFailed, Unauthorized, UnprocessableEntity } from "./httpErrors";

import { JWTData } from "@/typings";

const JWT_KEY: string = process.env.APP_JWT_KEY || 'JWT_KEY';
export const PREFIX = 'Bearer ';

export const getUserInfoOptional: RequestHandler<any, any, any, any, any> =
function getUserInfoOptional(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith(PREFIX)) {
        next();
        return;
    }
    getUserFromJWT(auth.slice(PREFIX.length)).then((user) => {
        req.user = user;
        next();
    }).catch(next);
}

export function getUserFromJWT(token: string): Promise<Request['user']> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_KEY, async (err, decoded) => {
            if (err) {
                let error = new PreconditionFailed(err.message);
                reject(error);
            } else {
                try {
                    const { u: userId } = (decoded as JWTData);
                    // const user = await Users.findByPk(userId);
                    const reqUser: Request['user'] = {
                        id: userId
                    };
                    resolve(reqUser);
                } catch(e) {
                    reject(e);
                }
            }
        });
    });
} 

export const validateAuth: RequestHandler<any, any, any, any, any> =
function validateAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith(PREFIX)) {
        throw new UnprocessableEntity();
    }
    getUserFromJWT(auth.slice(PREFIX.length)).then((user) => {
        req.user = user;
        next();
    }).catch(next);
}

export function issueToken(payload: JWTData): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_KEY, (err, encoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(encoded as string);
            }
        });
    });
}
