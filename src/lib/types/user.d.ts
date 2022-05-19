export interface User {
    _id: string,
    name: string,
    email: string,
    avatar_hash: string,
    about_me: string,
    verified: boolean
}

export interface EmailVerificationToken {
    id: string,
    email: string
}