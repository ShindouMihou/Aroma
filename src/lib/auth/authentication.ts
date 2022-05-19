import configuration from "$lib/configuration";
import mongo from "$lib/mongo";
import * as jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import type Account from "$lib/models/user";

/**
 * Generates a 30 days lifetime identifier token that is used to identify the user. This uses a JWT with the 
 * identifier present and no other details as any other data in the user is not immutable.
 * 
 * @param user The user to referece for generating this identifier token.
 * @returns A simple identifier token that contains the id of the user in a JWT.
 */
export function sign(user: Account): string {
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

/**
 * Generates a 24 hours lifetime email verification token that is used to verify the user's account. This 
 * uses a JWT with the identifier and email present.
 * 
 * This will expire after 24 hours but during that period, it can be used to verify the user's account as long 
 * as the user's account is not verified yet.
 * 
 * @param user The user to reference for generating this verification token.
 * @returns The verification token which should return the email address and id of the user in a JWT.
 */
export function verification(user: Account): string {
    if (!configuration('JWT_SECRET')) {
        throw {
            error: 'JWT_SECRET is not configured, please configure it.'
        }
    }


    return jwt.sign({
        id: user._id,
        email: user.email
    }, configuration('JWT_SECRET') || '', {
        expiresIn: '1d'
    })
}

/**
 * Decodes a JWT token, specifically an identifier token, and returns the identifier of the user.
 *  
 * @param token The token to decode.
 * @returns The identifier of the user.
 */
export function get(token: string): string | null {
    return decode(token)?.id || null
}

/**
 * Decodes a JWT token and returns the payload. This performs verification of lifetime and other 
 * details beforehand.
 * 
 * @param token The token to decode.
 * @returns The decoded JWT token payload.
 */
export function decode(token: string): any | null {
    if (!configuration('JWT_SECRET')) {
        throw {
            error: 'JWT_SECRET is not configured, please configure it.'
        }
    }

    try {
        const decoded: any = jwt.verify(token, configuration('JWT_SECRET') || '')
        return decoded
    } catch(err) {
        return null
    }
}

/**
 * Attempts to authenticate the user by comparing the hashes of the stored password and 
 * the given password.
 * 
 * @param email The email address of the user.
 * @param password The password of the user.
 * @returns Whether the user is authenticated or not.
 */
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