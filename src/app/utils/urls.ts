import ENV from "./env";

const URLS = {
    // checkAuth: `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/auth/isAuth`,

    uploadFileUrl: `${ENV.API_GATEWAY_URL}/chat/file/upload`,
    socketUrl: `${ENV.API_GATEWAY_URL}/chat`,
    checkAuth: `${ENV.API_GATEWAY_URL}/auth/api/protected/auth/isAuth`,
    verifyEmail: `${ENV.API_GATEWAY_URL}/auth/api/verify-email`,
    signOut: `${ENV.API_GATEWAY_URL}/auth/api/auth/google`,
    logIn: `${ENV.API_GATEWAY_URL}/auth/api/login`,
    registerTemp: `${ENV.API_GATEWAY_URL}/auth/api/register-temp`
}
export default URLS;