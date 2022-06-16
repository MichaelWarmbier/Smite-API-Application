#!/usr/bin/env node

/*////////// Packages //////////*/

var md5 = require('md5');
var fetch = require('node-fetch'); 
var prompt = require('prompt-sync')({sigint: true}); 
var fs = require('fs'); 

const godData = require('./gods.json');

/*////////// Secrets (Replit only) //////////*/

const username = process.env['usrname'];
const password = process.env['pswd'];
const s_devId = process.env['devID']
const s_authKey = process.env['key']
 
/*////////// Data //////////*/

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

/*////////// Main Loop //////////*/

console.log(green, "Smite API Application");
main();

async function main() {

  let menuInput = await '';
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
    console.log(blue, "\nEnter which menu?");
    console.log("[1] - Player Methods");
    console.log("[2] - God and Item Methods");
    console.log("[3] - Other Methods");
    menuInput = prompt("[SELECTION]: ");

    console.log(blue, "\nRun which of the following commands?");
    switch (menuInput) {
      case '1': {
        console.log("[1] - Get Player Data");
        console.log("[2] - Get Friend/Blocked Data");
        break;
      }
      case '2': {
        console.log("[1] - Get God Data");
        console.log("[2] - Get Item Data");
        console.log("[3] - Get God Skin Data");
        break;
      }
      case '3': {
        console.log("[1] - Get Server Status");
        console.log("[2] - Get Patch Info");
        console.log("[3] - Get Data Used");
        break;
      }
    }
    firstInput = await prompt("[SELECTION]: ");

    if (menuInput != 3 || firstInput != '3') {
      // Secondary Prompt
      console.log(blue, "\nChoose one of the following:");
      console.log("[1] - Save as File");
      console.log("[2] - Output as Link");
      console.log("[3] - Both");
      secondInput = prompt("[SELECTION]: ");
      if (secondInput > 3 || secondInput < 1) firstInput = -1;
    }

    // Tertiary Prompt -- playername
    if (menuInput == 1) {
      console.log (blue, "\nEnter the name of the player:")
      thirdInput = prompt("[NAME]: ");
    }

    // Tertiary Prompt -- godname
    if (menuInput == 2 && firstInput == 3) {
      console.log (blue, "\nEnter the name of the God:")
      thirdInput = prompt("[NAME]: ");
    }
    
    // Hande Input
    try {
      switch (menuInput) {
        case '1': {
          if (firstInput == '1') await getPlayer(1, secondInput, thirdInput);
          else if (firstInput == '2') await getFriends(1, secondInput, thirdInput);
          else console.log(red, "ERROR: Invalid option selected");
          break;
        }
        case '2': {
          if (firstInput == '1') await getInfo("gods", secondInput);
          else if (firstInput == '2') await getInfo("items", secondInput);
          else if (firstInput == '3') await getGodSkins(secondInput, thirdInput);
          else console.log(red, "ERROR: Invalid option selected");
          break;
        }
        case '3': {
          if (firstInput == '1') await getHirezServerStatus(secondInput);
          else if (firstInput == '2') await getPatchInfo(secondInput);
          else if (firstInput == '3') await getDataUsed();
          else console.log(red, "ERROR: Invalid option selected");
          break;
        }
        default: console.log(red, "ERROR: Invalid option selected"); break;
      }
    } catch(e) { 
      console.log(red, '\n\nERROR: Unable to access API properly.\n\n')
      console.log(red, "ERROR: " + e); 
    }

  } while (1);
}

/*////////// Utility Methods //////////*/

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

/*////////// Primary Methods //////////*/

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

// getPlayer()


async function getPlayer(flag, code, player) {
  
  const signature = md5(devId + 'getplayer' + authKey + getTimeStamp());
  
  let link = smiteAPI + "getplayerjson/" + devId + '/' + signature + '/' + sID + '/' + getTimeStamp() + '/' + encodeURI(player);

  resp = await fetch(link);
  data = await resp.json();

  if (data[0] == null) {
    console.log(red, "\nERROR: Invalid player.\n");
    return;
  }
  else if (data[0].ret_msg != null && data[0].ret_msg.includes('Player Privacy Flag set')) {
    console.log(red, "\nERROR: Player profile set to private.\n");
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

// getHirezServerStatus()

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

// getDataUsed()

async function getDataUsed() {
  
  const signature = md5(devId + 'getdataused' + authKey + getTimeStamp());
  console.log(cyan, "[API CALL]: /getdataused");
  
  let link = smiteAPI + "getdatausedjson/" + devId + '/' + signature + '/' + sID + '/' + getTimeStamp();

  resp = await fetch(link);
  
  console.log(purple, "SESSION = " + sID);
  console.log(purple, "URL = " + link + '\n');
  return;
}

// getPatchInfo()

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

// getMOTD() -- ADD LATER

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

// getFriends()

async function getFriends(flag, code, player) {
  
  const signature = md5(devId + 'getfriends' + authKey + getTimeStamp());
  
  let link = smiteAPI + "getfriendsjson/" + devId + '/' + signature + '/' + sID + '/' + getTimeStamp() + '/' + encodeURI(player);

  resp = await fetch(link);
  data = await resp.json();

  if (data[0] == null) {
    console.log(red, "\nERROR: Invalid player.\n");
    return;
  }
  else if (data[0].ret_msg != null && data[0].ret_msg.includes('Player Privacy Flag set')) {
    console.log(red, "\nERROR: Player profile set to private.\n");
    return;
  }

  if (flag) {
    console.log(cyan, "[API CALL]: /getfriends");
    if (code == 2 || code == 3) console.log(purple, "URL = " + link + '\n');
  }

  if ((code == 1 || code == 3) && flag) {
    output = JSON.stringify(data);
    fs.writeFile(player + "_friends.json", output, function (err) {
        if (err) return console.log(red, err);
      })
    console.log(orange, player + "_friends.json created successfully.\n");
  }
  return data[0].Id;

}

// getGodSkins() 

async function getGodSkins(code, god) {
  
  const signature = md5(devId + 'getgodskins' + authKey + getTimeStamp());
  let godID = null;

  for (let i = 0; i < godData.length; i++)
    if (godData[i].Name.toLowerCase() == god.toLowerCase())
      godID = godData[i].id;

  if (godID == null) {
    console.log(red, "\nERROR: God name not found.\n");
    return;
  }
  
  let link = smiteAPI + "getgodskinsjson/" + devId + '/' + signature + '/' + sID + '/' + getTimeStamp() + '/' + godID + '/1';

  resp = await fetch(link);
  data = await resp.json();

  console.log(cyan, "[API CALL]: /getgodskins");
  if (code == 2 || code == 3) console.log(purple, "URL = " + link + '\n');

  output = JSON.stringify(data);
  fs.writeFile(god + "_skins.json", output, function (err) {
      if (err) return console.log(red, err);
    })
  console.log(orange, god + "_skins.json created successfully.\n");
  return data[0].Id;

}