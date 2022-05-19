import { decode } from "$lib/auth/authentication";
import mongo from "$lib/mongo";
import type { EmailVerificationToken } from "$lib/types/user";
import type { RequestEvent } from "@sveltejs/kit/types/private";
import * as UserBase from '$lib/models/user'
import { ObjectId } from "mongodb";

export async function get(event: RequestEvent) {
    try {
        if (!event.url.searchParams.get('token')) {
            return {
                status: 400,
                body: {
                    error: "Invalid request unique identifier resource."
                }
            }
        }
    
        const token: EmailVerificationToken = decode(event.url.searchParams.get('token')!)

        if (!token || !(token.email && token.id)) {
            return {
                status: 400,
                body: {
                    error: "Invalid token."
                }
            }
        }
    
        const client = (await mongo.getClient())!
    
        if (event.locals.user && event.locals.user._id != token.id) {
            return {
                body: {
                    error: "You cannot perform this action."
                },
                status: 401
            }
        }
    
        const user = await UserBase.get(token.id)
    
        if (!user || user.email != token.email || user.verified) {
            return {
                status: 400,
                body: {
                    error: "Invalid token."
                }
            }
        }
    
        await client.db('aroma').collection('users').updateOne({
            _id: new ObjectId(token.id)
        }, {
            $set: {
                'verified': true
            }
        })

        return {
            status: 204
        }
    } catch (err: any) {
        console.error(err)
        return {
            status: 500,
            body: {
                error: "An internal error occurred while trying to verify with the token."
            }
        }
    }

}