#!/usr/bin/env node

/* Packages */

var md5 = require('md5');
var fetch = require('node-fetch'); 
var prompt = require('prompt-sync')({sigint: true}); 
var fs = require('fs'); 

/* Secrets [Only works on Replit] */

const username = process.env['usrname'];
const password = process.env['pswd'];
const s_devId = process.env['devID']
const s_authKey = process.env['key']
 
/* Variables */

const orange = "\x1b[33m%s\x1b[0m";
const green = "\x1b[32m%s\x1b[0m";
const blue = "\x1b[34m%s\x1b[0m";
const red = "\x1b[31m%s\x1b[0m";
const purple = "\n\x1b[35m%s\x1b[0m";
const cyan = "\n\x1b[36m%s\x1b[0m"

const smiteAPI = "https://api.smitegame.com/smiteapi.svc/";
var platform = "PC";

var input = null; 
var devId = null; 
var authKey = null;
var sID = null;

/* Main Loop */

console.log(green, "Smite API Application");
main();

async function main() {

  let firstInput = await '';
  let secondInput = await '';
  let thirdInput = await '';
  let validInput = false;
  
  console.log(orange, "Use ctrl + c to exit at any time.\n");

  do {
    // Login Prompt
    input = prompt("Enter your developer ID: "); devId = input;
    input = prompt("Enter your authentication key: "); authKey = input;
  
    // Check Ownership
    if (devId == username && authKey == password) {
      console.log(green, "Successfully logged in as owner.");
      devId = s_devId;
      authKey = s_authKey;
    }

    // Login Validation
    let resp = await fetch(createSession());
    let data = await resp.json();
    if (data.ret_msg == "Approved") {
      sID = await data.session_id;
      validInput = true;
    }
    else 
      console.log(red, "\nERROR: Invalid credentials.\n")
    
  } while(!validInput) 

  console.log(green, "\nSession established.");
  console.log(red, "\n[WARNING]: New session will\nneed to be established in 15 minutes.\n")
  console.log(blue, "Pinging server..");

  do {
  
    // Ping server
    resp = await fetch("https://api.smitegame.com/smiteapi.svc/pingjson");
    data = await resp.json();
    console.log(orange, data);
    console.log(orange, "[Platform]: " + platform)

    if (data.indexOf("Ping successful") == -1) 
      console.log(red, "Ping unsuccessful. Unable to access SmiteAPI");

    // Prompt user
    console.log(blue, "\nRun which of the following commands?");
    console.log("[1] - Get Server Status");
    console.log("[2] - Get Data Used");
    console.log("[3] - Get God Data");
    console.log("[4] - Get Item Data");
    console.log("[5] - Get Player Data")
    console.log("[6] - Get Patch Info")
    firstInput = prompt("[SELECTION]: ");

    if (firstInput != '2') {
      // Secondary Prompt
      console.log(blue, "\nChoose one of the following:");
      console.log("[1] - Save as File");
      console.log("[2] - Output as Link");
      console.log("[3] - Both");
      secondInput = prompt("[SELECTION]: ");
      if (secondInput > 3 || secondInput < 1) firstInput = -1;
    }

    if (firstInput == '5') {
      console.log (blue, "\nName of player you wish to use:")
      thirdInput = prompt("[NAME]: ");
    }
    
    // Hande Input
    try {
      switch (firstInput) {
        case '1': await getHirezServerStatus(secondInput); break;
        case '2': await getDataUsed(); break;
        case '3': await getInfo("gods", secondInput); break;
        case '4': await getInfo("items", secondInput); break;
        case '5': await getPlayer(1, secondInput, thirdInput); break;
        case '6': await getPatchInfo(secondInput); break;
        case '7': await getMOTD(secondInput); break;
        default: console.log(red, "ERROR: Invalid option selected"); break;
      }
    } catch(e) { 
      console.log(red, '\n\nERROR: Unable to access API properly.\n\n')
      console.log(red, "ERROR: " + e); 
    }

  } while (1);
}

/* Utility Methods
These functions are used for grabbing specific information that is used as a parameter for the primary ones, with the exception of getplayer() which acts as both. */

function getTimeStamp() {

  const date = new Date();
  let year, month, day, hour, minute, second;

  year = date.getUTCFullYear();
  if (date.getUTCMonth() < 10) month = '0' + (date.getUTCMonth() + 1); 
  else month = date.getUTCMonth() + 1;
  if (date.getUTCDate() < 10) day = '0' + date.getUTCDate(); 
  else day = date.getUTCDate();
  if (date.getUTCHours() < 10) hour = '0' + date.getUTCHours(); 
  else hour = date.getUTCHours();
  if (date.getUTCMinutes() < 10) minute = '0' + date.getUTCMinutes(); 
  else minute = date.getUTCMinutes();
  if (date.getUTCSeconds() < 10) second = '0' + date.getUTCSeconds(); 
  else second = date.getUTCSeconds();

  return '' + year + month + day + hour + minute + second;

}

function createSession() {
  const signature = md5(devId + "createsession" + authKey + getTimeStamp());
  return smiteAPI + "createsessionjson/" + devId + '/' + signature + '/' + getTimeStamp();
}

/* Primary Methods (wrappers) */

async function getInfo(info, code) {
  const signature = md5(devId + "get" + info + authKey + getTimeStamp());
  console.log(cyan, "[API CALL]: /get" +info);
  let link = (smiteAPI + 'get' + info + 'json/' + devId + '/' + signature + '/' + sID + '/' + getTimeStamp() + '/' + '1')
  if (code == 2 || code == 3) {
    console.log(purple, 'URL = ' + link + '\n');
  }

  try {
    resp = await fetch(link);
    data = await resp.json();
  } catch (e) { console.log (red, "\nERROR: Unable to fetch information.\n\n" + e)}

  if (code == 1 || code == 3) {
    output = JSON.stringify(data);
    fs.writeFile(info + '.json', output, function (err) {
        if (err) return console.log(red, err);
      })
      console.log(orange, info + ".json created successfully.\n");
  }
  return;

}

//////////////////


async function getPlayer(flag, code, player) {
  
  const signature = md5(devId + 'getplayer' + authKey + getTimeStamp());
  
  let link = smiteAPI + "getplayerjson/" + devId + '/' + signature + '/' + sID + '/' + getTimeStamp() + '/' + encodeURI(player);

  resp = await fetch(link);
  data = await resp.json();

  if (data[0] == null) {
    console.log(red, "\nERROR: Invalid player.\n")
    return;
  }

  if (flag) {
    console.log(cyan, "[API CALL]: /getplayer");
    if (code == 2 || code == 3) console.log(purple, "URL = " + link + '\n');
  }

  if ((code == 1 || code == 3) && flag) {
    output = JSON.stringify(data);
    fs.writeFile(data[0].Name + ".json", output, function (err) {
        if (err) return console.log(red, err);
      })
    console.log(orange, data[0].Name + ".json created successfully.\n");
  }
  return data[0].Id;

}

/////////////////

async function getHirezServerStatus(code) {
  
  const signature = md5(devId + 'gethirezserverstatus' + authKey + getTimeStamp());
  console.log(cyan, "[API CALL]: /gethirezserverstatus");
  
  let link = smiteAPI + "gethirezserverstatusjson/" + devId + '/' + signature + '/' + sID + '/' + getTimeStamp();
  
  if (code == 2 || code == 3) console.log(purple, "URL = " + link + '\n');

  resp = await fetch(link);
  data = await resp.json();
  
  if (code == 1 || code == 3) {
    output = JSON.stringify(data);
    fs.writeFile("HirezSatus" + getTimeStamp() + ".json", output, function (err) {
        if (err) return console.log(red, err);
      })
    console.log(orange, "HirezStatus" + getTimeStamp() + ".json created successfully.\n");
  }
  return;
}

/////////////////

async function getDataUsed() {
  
  const signature = md5(devId + 'getdataused' + authKey + getTimeStamp());
  console.log(cyan, "[API CALL]: /getdataused");
  
  let link = smiteAPI + "getdatausedjson/" + devId + '/' + signature + '/' + sID + '/' + getTimeStamp();

  resp = await fetch(link);
  
  console.log(purple, "SESSION = " + sID);
  console.log(purple, "URL = " + link + '\n');
  return;
}

/////////////////

async function getPatchInfo(code) {
  
  const signature = md5(devId + 'getpatchinfo' + authKey + getTimeStamp());
  console.log(cyan, '[API CALL]: /getpatchinfo');
  
  let link = (smiteAPI + 'getpatchinfojson' + '/' + devId + '/' + signature + '/' + sID + '/' + getTimeStamp());
  
  if (code == 2 || code == 3) console.log(purple, 'URL = ' + link + '\n');

  resp = await fetch(link);
  data = await resp.json();

  if (code == 1 || code == 3) {
    output = JSON.stringify(data);
    fs.writeFile('patch' + data.version_string + '.json', output, function (err) {
        if (err) return console.log(red, err);
      })
    console.log(orange, 'patch.json created successfully.\n');
  }
  return;
  
}

/////////////////

async function getMOTD(code) {

  const signature = md5(devId + 'getmotd' + authKey + getTimeStamp());
  console.log(cyan, '[API CALL]: /getmotd');

    let link = (smiteAPI + 'getmotdjson' + '/' + devId + '/' + signature + '/' + sID + '/' + getTimeStamp());
  
  if (code == 2 || code == 3) console.log(purple, 'URL = ' + link + '\n');

  resp = await fetch(link);
  data = await resp.json();

  if (code == 1 || code == 3) {
    output = JSON.stringify(data);
    fs.writeFile('MOTD' + getTimeStamp() + '.json', output);
    console.log(orange, 'MOTD' + getTimeStamp() + '.json created successfully.\n');
  }
  return;
  
}
