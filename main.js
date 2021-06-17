import xapi from 'xapi';
//import fetch from 'fetch';

//const fetch = require("node-fetch");

function getJSON(){

const url = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`;
return xapi.Command.HttpClient.Get({ Url: url })
.then(r => JSON.parse(r.Body))
.then(res => res.url)

}

async function init() {
const JSON = await getJSON();
console.log(JSON);

}
console.log('ferdig')
init();
