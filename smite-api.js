#!/usr/bin/env node

// dependencies

var md5 = require('md5'); // npm install md5
var fetch = require('node-fetch'); // npm install node-fetch
var prompt = require('prompt-sync')({sigint: true}); // npm install prompt-sync
var fs = require('fs'); // npm install fs

// variables

const smiteAPI = 'https://api.smitegame.com/smiteapi.svc/';

var input = ''; var devId = ''; var authKey = '';

// main

console.log("\x1b[42m%s\x1b[0m", "Smite API Application V.1");
console.log("Use ctrl + c to exit\n\n");

setTimeout(async function() {
  resp = await fetch(smiteAPI + 'pingjson');
  data = await resp.json();
  console.log(data);
}, 2000);

input = prompt("Enter your developer ID: "); devId = input;
input = prompt("Enter your authentication key: "); authKey = input;


console.log("\n\x1b[34m\x1b[0m", "\bPinging server..")

setTimeout(async function() {
  resp = await fetch(smiteAPI + 'pingjson');
  data = await resp.json();
  if (data.indexOf("Ping successful") == -1) { console.log("Ping unsuccessful. Unable to access SmiteAPI"); valid = false; }
}, 2000)

setTimeout(async function() { getInfo('items'); }, 2000);
setTimeout(async function() { getInfo('gods'); }, 2000);

// methods

function getTimeStamp() {

  const ts = new Date();
  let year, month, day, hour, minute, second;

  year = ts.getUTCFullYear();
  if (ts.getUTCMonth() < 10) month = '0' + (ts.getUTCMonth() + 1); else month = ts.getUTCMonth() + 1;
  if (ts.getUTCDate() < 10) day = '0' + ts.getUTCDate(); else day = ts.getUTCDate();
  if (ts.getUTCHours() < 10) hour = '0' + ts.getUTCHours(); else hour = ts.getUTCHours();
  if (ts.getUTCMinutes() < 10) minute = '0' + ts.getUTCMinutes(); else minute = ts.getUTCMinutes();
  if (ts.getUTCSeconds() < 10) second = '0' + ts.getUTCSeconds(); else second = ts.getUTCSeconds();


  return year + month + day + hour + minute + second;

}

function createSession() {

  const signature = md5(devId + 'createsession' + authKey + getTimeStamp());
  return smiteAPI + 'createsessionjson/' + devId + '/' + signature + '/' + getTimeStamp();

}

async function getInfo(info) {

  if (info != "gods"  && info != "items") { console.log("Error. getInfo() used improperly. Argument should be either gods or items. "); return; }

  let failure = false;
  const signature = md5(devId + 'get' + info + authKey + getTimeStamp());

  let resp = await fetch(createSession());
  let data = await resp.json();
  let sID= data.session_id;

  if (sID.length < 2) { sID = "Error grabbing session."; failure = true; }

  console.log("\x1b[42m%s\x1b[0m", "SmiteAPI GetItems");
  console.log('\x1b[31m%s\x1b[0m', '\nSESSION ID = '); console.log(sID); // Log valid session ID
  console.log('\n\x1b[31m%s\x1b[0m', 'URL = '); console.log(smiteAPI + 'get' + info + 'json/' + devId + '/' + signature + '/' + sID + '/' + getTimeStamp() + '/' + '1\n\n') // log final link

  try {
    resp = await fetch(smiteAPI + 'get' + info + 'json/' + devId + '/' + signature + '/' + sID + '/' + getTimeStamp() + '/' + '1');
    data = await resp.json();
  }
  catch (err) {
    console.log("Invalid response. Check server status and credentials and try again.");
    failure = true;
  }

  if (failure) console.log("Unable to grab " + info + " information.\n")
  else {
    output = JSON.stringify(data);
    fs.writeFile(info + ".json", output, function (err) {
      if (err) return console.log(err);
    })
    console.log(info + ".json created successfully.");
  }

}
