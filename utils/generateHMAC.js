import axios from "axios"

export const hmacToken = async (url, data) => {
    const headers = {
        "Content-Type": "application/json",
        "appid": process.env.APP_ID,
        "secrettoken": process.env.SECRET_TOKEN,
        "usertoken": process.env.USER_TOKEN,
        "x-api-key": process.env.X_API_KEY,
        "url": url
    }

    try {
        const tokenRes = await axios.post(`https://uat-auth-ace.allcloud.app/enterprise-generatetoken`, data, { headers })
        return tokenRes.data

    } catch (error) {
        console.log('HMAC error ', error)
        throw new Error(error.message || "Error in HMAC creation!")

    }


}