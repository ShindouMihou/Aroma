import type { RequestEvent } from "@sveltejs/kit/types/private";
import Account from "$lib/models/user"
import { verification } from "$lib/auth/authentication";
import AromaticEmails from "$lib/email";
import AromaticEmailTemplates from "$lib/templates/emails";
import AromaticRouteResponses from "$lib/templates/responses";

export async function post(event: RequestEvent) {
    if (event.locals.user) {
        return AromaticRouteResponses.permitNotGranted;
    }

    try {
        const body = await event.request.json()
        const request = {
            name: body.name,
            email: body.email,
            password: body.password
        }

        try {
            const user = await Account.create(request.name, request.email, request.password)
            const token = await verification(user)

            await AromaticEmails.send(
                'aromatic@erisa.one',
                request.email,
                'Welcome to Aroma',
                undefined,
                AromaticEmailTemplates.verification(`http://localhost:3000/api/auth/verify?token=${token}`)
            )

            return {
                body: user
            }
        } catch (err: any) {
            if (err.error) {
                return {
                    body: err,
                    status: 400
                }
            }

            console.error(err)
            return AromaticRouteResponses.internalError;
        }
    } catch (jsonError: any) {
        return AromaticRouteResponses.invalidResourceContentType;
    }
}