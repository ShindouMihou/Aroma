import { decode } from "$lib/auth/authentication";
import mongo from "$lib/mongo";
import type { RequestEvent } from "@sveltejs/kit/types/private";
import Account from '$lib/models/user'

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
    
        const token: {
            id: string,
            email: string
        } = decode(event.url.searchParams.get('token')!)

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
    
        const user = await Account.withId(token.id)
    
        if (!user || user.email != token.email || user.verified) {
            return {
                status: 400,
                body: {
                    error: "Invalid token."
                }
            }
        }
    
        await user.verify()

        return { status: 204 }
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