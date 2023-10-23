const schedule = require("node-schedule");
const axios = require("axios");
const accountSid = "AC6dbcde5dd7ff01837038af8eef7abf1a";
const authToken = "2e0963a7e354373ccedd1293f3b3c6f0";
const client = require("twilio")(accountSid, authToken);
const API_KEY = "319370dd37d91cbdcbc002eb56be3dbf";
const url = "http://api.exchangeratesapi.io/v1/";
let currency = "PHP";
let desiredRate = parseFloat(41.41).toFixed(2);
let base = "CAD";
let cientInfo = {curreny:"",amount,email,number}

let count = 1;
schedule.scheduleJob("*/10 * * * * *", () => {
  axios
    .get(`${url}latest?access_key=${API_KEY}&base=${base}&symbols=${currency}`)
    .then((res) => {
      const data = res.data;
      const rates = data.rates;
      const rateForCurrency = parseFloat(rates[currency]).toFixed(2);
      console.log(rateForCurrency);
      //console.log(typeof [rateForCurrency]);
      if (rateForCurrency >= desiredRate) {
        //console.log("send message format 1");
        sendMessage1(currency, desiredRate, rateForCurrency);
      } else if (rateForCurrency < desiredRate) {
        //console.log("send message format 2");
        sendMessage2(currency, desiredRate, rateForCurrency);
      } else {
        console.log("no message");
      }
    });
  console.log("test no: " + count);
  count++;
});

function sendMessage1(currency, desiredRate, rate){
  client.messages
  .create({
    body: "Your tracked currency of "+ currency+ " is now equals or above your desired rate of "
    + desiredRate+ ". The current rate is " + rate,
    from: "+19042893746",
    to: "+15146900134",
  })
  .then((message) => console.log(message.sid));
}

function sendMessage2(currency, desiredRate, rate){
  client.messages
  .create({
    body: "Your tracked currency of "+ currency+ " is now below your desired rate of "
    + desiredRate+ ". The current rate is: " + rate,
    from: "+19042893746",
    to: "+15146900134",
  })
  .then((message) => console.log(message.sid));
}

function getRates(symbols) {
  const currObjArray = [];
  fetch(`${url}latest?access_key=${API_KEY}&base=${base}&symbols=${symbols}`)
    .then((res) => res.json())
    .then((data) => {
      const rates = data.rates;
      Object.entries(rates).forEach(([currency, rate]) => {
        //console.log(`${currency}: ${rate}`);
        let currObj = { currSymbol: currency, currentRate: rate };
        currObjArray.push(currObj);
      });
    });
  currObjArray.forEach((data) => {
    console.log(data);
  });
  return currObjArray;
}