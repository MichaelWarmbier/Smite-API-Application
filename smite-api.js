#!/usr/bin/env node

/* Packages */

var md5 = require('md5'); // npm install md5
var fetch = require('node-fetch'); // npm install node-fetch
var prompt = require('prompt-sync')({sigint: true}); // npm install prompt-sync
var fs = require('fs'); // npm install fs

var orange = "\x1b[33m%s\x1b[0m";
var green = "\x1b[32m%s\x1b[0m";
var blue = "\x1b[34m%s\x1b[0m";
var red = "\x1b[31m%s\x1b[0m";
var purple = "\n\x1b[35m%s\x1b[0m";

/* Variables & Constants */

const smiteAPI = 'https://api.smitegame.com/smiteapi.svc/';
const conquestID = '450';
var input = ''; var devId = ''; var authKey = '';

/* Main Loop */

console.log(green, "Smite API Application");
main();

async function main() {

  // Introduce
  console.log(orange, "Use ctrl + c to exit at any time.\n");
  input = prompt("Enter your developer ID: "); devId = input;
  input = prompt("Enter your authentication key: "); authKey = input;

do {

  let firstInput = await '';
  let secondInput = await '';
  
  // Ping server
  console.log(blue, "\nPinging server..");
  resp = await fetch(smiteAPI + 'pingjson');
  data = await resp.json();
  console.log(data);

  if (data.indexOf("Ping successful") == -1) 
    console.log(red, "Ping unsuccessful. Unable to access SmiteAPI");

  // Prompt user
  console.log(blue, "\nRun which of the following commands?");
  console.log("[1] - Get god data\n[2] - Get item data\n"); 
  firstInput = prompt('');

  console.log(blue, "Choose one of the following:");
  console.log("[1] - Save as file\n[2] - Output as link\n[3] - Both\n");
  secondInput = prompt('');

  if (secondInput > 3 || secondInput < 1) firstInput = -1;

  // Determine results
  switch (firstInput) {
    // GetGods
    case '1': 
      try {
        await getInfo('gods', secondInput); 
      }
      catch (err) { console.log(red, "Error: " + err); }
    break;
    // GetItems
    case '2':
      try {
      await getInfo('items', secondInput); 
      }
      catch (err) { console.log(red, "Error: " + err); }
    break;
    default: console.log(red, "Invalid option selected"); break;
  }

} while (1);
}

/* Utility Methods */

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

/* Primary Methods */

async function getInfo(info, code) {

  let failure = false;
  const signature = md5(devId + 'get' + info + authKey + getTimeStamp());

  let resp = await fetch(createSession());
  let data = await resp.json();
  let sID = await data.session_id;

  if (sID.length < 2) { console.log(red,"Attempt to access API failed. Invalid credentials?\n"); return; }

  console.log(green, "SmiteAPI Get" + info);

  let link = (smiteAPI + 'get' + info + 'json/' + devId + '/' + signature + '/' +     sID + '/' + getTimeStamp() + '/' + '1')
  // Link
  if (code == 2 || code == 3) {
    console.log(purple, 'URL = '); console.log(link + '\n') 
  }
  // Grab
  resp = await fetch(link);
  data = await resp.json();

  // File
   
  if (code == 1 || code == 3) {
    output = JSON.stringify(data);
    fs.writeFile('output/' + info + '.json', output, function (err) {
      if (err) return console.log(err);
      })
      console.log(orange, info + ".json created successfully.\n");
  }

}