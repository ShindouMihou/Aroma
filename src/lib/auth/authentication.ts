import configuration from "$lib/configuration";
import mongo from "$lib/mongo";
import type { User } from "$lib/types/user";
import * as jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

export function sign(user: User): string {
    if (!configuration('JWT_SECRET')) {
        throw {
            error: 'JWT_SECRET is not configured, please configure it.'
        }
    }


    return jwt.sign({
        id: user._id
    }, configuration('JWT_SECRET') || '', {
        expiresIn: '30d'
    })
}

export function get(token: string): string | null {
    if (!configuration('JWT_SECRET')) {
        throw {
            error: 'JWT_SECRET is not configured, please configure it.'
        }
    }

    try {
        const decoded: any = jwt.verify(token, configuration('JWT_SECRET') || '')
        return decoded.id
    } catch(err) {
        return null
    }
}

export async function authenticate(email: string, password: string): Promise<boolean> {
    const client = (await mongo.getClient())!;

    const secret = await client.db('aroma').collection('userSecrets').findOne({
        email: email 
    })

    if (!secret) {
        return false
    }

    return bcrypt.compare(password, secret.password);
}