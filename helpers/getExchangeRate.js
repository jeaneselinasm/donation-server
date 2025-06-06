const axios = require("axios");
const url = "https://latest.currency-api.pages.dev/v1/currencies/usd.json";

async function getExchangeRate() {
    try {
        const { data } = await axios({
            method: "get",
            url,
        });
        const rate = data.usd.idr;
        return rate;
    } catch (error) {
        throw { code: 404, message: "Exchange rate is not found" };
    }
}

module.exports = getExchangeRate;
