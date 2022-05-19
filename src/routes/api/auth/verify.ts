import { decode } from "$lib/auth/authentication";
import mongo from "$lib/mongo";
import type { RequestEvent } from "@sveltejs/kit/types/private";
import Account from '$lib/models/user'
import AromaticRouteResponses from "$lib/templates/responses";

export async function get(event: RequestEvent) {
    try {
        if (!event.url.searchParams.get('token')) {
            return AromaticRouteResponses.invalidResourceParameters;
        }
    
        const token: {
            id: string,
            email: string
        } = decode(event.url.searchParams.get('token')!)

        if (!token || !(token.email && token.id)) {
            return AromaticRouteResponses.invalidResourceIdentifier;
        }
    
        const client = (await mongo.getClient())!
    
        if (event.locals.user && event.locals.user._id != token.id) {
            return AromaticRouteResponses.permitNotGranted;
        }
    
        const user = await Account.withId(token.id)
    
        if (!user || user.email != token.email || user.verified) {
            return AromaticRouteResponses.permitNotGranted;
        }
    
        await user.verify()

        return { status: 204 }
    } catch (err: any) {
        console.error(err)
        return AromaticRouteResponses.internalError;
    }

}