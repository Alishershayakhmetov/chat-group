import ENV from "./env";

const URLS = {
    checkAuth: `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/auth/isAuth`,

    // getUrlToUploadFile: `${ENV.API_GATEWAY_URL}/upload`,
    // socketUrl: `${ENV.API_GATEWAY_URL}/chat`,
    // checkAuth: `${ENV.API_GATEWAY_URL}/auth/api/protected/auth/isAuth`,
    // verifyEmail: `${ENV.API_GATEWAY_URL}/auth/api/verify-email`
}
export default URLS;