const axios = require('axios');

const apilayer = "http://www.apilayer.net/api/live?access_key=c9329a2eab55820cea9b9388edd7c91d&format=1"

const getExchangeRate = async (fromCurrency, toCurrency) => {
  const res = await axios.get(apilayer);

  const rate = res.data.quotes;
  const euro = 1 / rate[`USD${fromCurrency}`];
  const exchangeRate = euro * rate[`USD${toCurrency}`];

  if(isNaN(exchangeRate)) {
    throw new Error(`unable to get currency ${fromCurrency} and ${toCurrency}`);
  }

  return exchangeRate
}

const getCountries = async (toCurrency) => {
  try {
    const res = await axios.get(`https://restcountries.eu/rest/v2/currency/${toCurrency}`);

    return res.data.map(country => country.name);
  } catch {
    throw new Error(console.log(`unable to get countries that use ${toCurrency}`));
  }
}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  const countries = await getCountries(toCurrency);
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = (amount * exchangeRate).toFixed(2);

  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.\n\n You can spent these to the following countries:\n ${countries}`
}

convertCurrency('USD', 'CAD', 30)
  .then(message => console.log(message))
  .catch(error => console.log(error.message));