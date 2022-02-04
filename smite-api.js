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

var orange = "\x1b[33m%s\x1b[0m";
var green = "\x1b[32m%s\x1b[0m";
var blue = "\x1b[34m%s\x1b[0m";
var red = "\x1b[31m%s\x1b[0m";
var purple = "\n\x1b[35m%s\x1b[0m";
var cyan = "\n\x1b[36m%s\x1b[0m"

const smiteAPI = "https://api.smitegame.com/smiteapi.svc/";
var platform = "PC";
const conquestID = "450";

var input = null; 
var devId = null; 
var authKey = null;
var sID = null;

/* Main Loop */

console.log(green, "Smite API Application");
main();

async function main() {

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
    
    let firstInput = await '';
    let secondInput = await '';
    let thirdInput = await '';
  
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
    switch (firstInput) {
      // GetHirezServerStatus
      case '1': 
        try {
          await getHirezServerStatus(secondInput);
        }
        catch (err) { console.log(red, "ERROR: " + err); }
      break;
      // GetDataUsed
      case '2': 
        await getDataUsed();
      break;
      // GetGods
      case '3': 
        try {
          await getInfo("gods", secondInput); 
        }
        catch (err) { console.log(red, "ERROR: " + err); }
      break;
      // GetItems
      case '4':
        try {
          await getInfo("items", secondInput); 
        }
        catch (err) { console.log(red, "ERROR: " + err); }
      break;
      // GetPlayer
      case '5': 
        try {
          await getPlayer(1, secondInput, thirdInput);
        }
        catch (err) {console.log(red, "ERROR: " + err); }
      break;
      default: console.log(red, "ERROR: Invalid option selected"); break;
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

/* Primary Methods
These functions are what actually drive each API call and are each called by the switch statement included in mai(). */

async function getInfo(info, code) {
  const signature = md5(devId + "get" + info + authKey + getTimeStamp());
  console.log(cyan, "[API CALL]: /get" + info);
  let link = (smiteAPI + 'get' + info + 'json/' + devId + '/' + signature + '/' + sID + '/' + getTimeStamp() + '/' + '1')
  if (code == 2 || code == 3) {
    console.log(purple, 'URL = ' + link + '\n');
  }
  resp = await fetch(link);
  data = await resp.json();
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
    if (code == 2 || code == 3) {
      console.log(purple, "URL = " + link + '\n');
    }
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
  if (code == 2 || code == 3) {
    console.log(purple, "URL = " + link + '\n');
  }
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
  console.log(purple, "SESSION = " + sID);
  console.log(purple, "URL = " + link + '\n');
  return;
}