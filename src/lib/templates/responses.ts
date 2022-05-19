export default class AromaticRouteResponses {

    public static invalidResourceIdentifier: any = {
        body: {
            error: "Invalid resource identifier, the item requested does not exist."
        },
        status: 404
    };

    public static invalidRequest: any = {
        body: {
            error: "The request does not meet any of our specifications."
        },
        status: 400
    }

    public static invalidResourceContentType: any = {
        body: {
            error: "Invalid request content-type."
        },
        status: 400
    };

    public static invalidResourceParameters: any = {
        body: {
            error: "Invalid request query paramters."
        },
        status: 400
    };

    public static permitNotGranted: any = {
        body: {
            error: "You cannot perform this action."
        },
        status: 401
    };

    public static internalError: any = {
        body: {
            error: "An internal error occurred while trying to perform an action of this requested resource, this is something that can only be fixed by the developers."
        },
        status: 500
    }

}