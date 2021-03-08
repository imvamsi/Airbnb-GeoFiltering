 import cookies from "js-cookie";

export function getTokenCookie() {
    return cookies.get()
}

export function setTokenCookie(token: string) {
    return cookies.set('token', token, {
        expires: 1/24
    })
}

export function removeTokenCookie() {
    return cookies.remove('token')
}