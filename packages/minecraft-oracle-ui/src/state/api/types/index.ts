export type EmailLoginCode = {
    email: string
    "g-recaptcha-response": string
}

export type EmailLoginCodeResponse = {
    success: true
}