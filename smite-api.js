#!/usr/bin/env node

/*////////// Packages //////////*/

var md5 = require('md5');
var fetch = require('node-fetch'); 
var prompt = require('prompt-sync')({sigint: true}); 
var fs = require('fs'); 

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

  let menuInput = '';
  let firstInput = '';
  let secondInput = '';
  let thirdInput = '';
  let fourthInput = '';
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
    console.log("[3] - Match Methods")
    console.log("[4] - Other Methods");
    menuInput = prompt("[SELECTION]: ");

    if (menuInput >= 1 && menuInput <= 4)
      console.log(blue, "\nRun which of the following commands?");
    else {
      console.log(red, "\nERROR: Invalid option selected.\n");
      continue;
    }
    switch (menuInput) {
      case '1': {
        console.log("[b] - Go Back");
        console.log("[1] - Get Player Data");
        console.log("[2] - Get Friend/Blocked Data");
        console.log("[3] - Get Player Match History");
        break;
      }
      case '2': {
        console.log("[b] - Go Back");
        console.log("[1] - Get God Data");
        console.log("[2] - Get Item Data");
        console.log("[3] - Get God Skin Data");
        console.log("[4] - Get God Leaderboard Data");
        break;
      }
      case '3': {
        console.log("[b] - Go Back");
        console.log("[1] - Get MOTD Data");
        console.log("[2] - Get Match Details");
        break;
      }
      case '4': {
        console.log("[b] - Go Back");
        console.log("[1] - Get Server Status");
        console.log("[2] - Get Patch Info");
        console.log("[3] - Get Data Used");
        break;
      }
    }
    firstInput = await prompt("[SELECTION]: ");
    if (firstInput == 'b') continue;

    if (menuInput != 4 || firstInput != '3') {
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
    if (menuInput == 2 && (firstInput == 3 || firstInput == 4)) {
      console.log (blue, "\nEnter the name of the God:")
      thirdInput = prompt("[NAME]: ");
    }

    // Tertiary Prompt -- match_id
    if (menuInput == 3 && firstInput == 2) {
      console.log(orange, "\nGo to [Player Methods > Get Player Match History] to get recent match IDs.");
      console.log(red, "WARNING: Method may be slow, please be patient.");
      console.log (blue, "Enter the match ID:")
      thirdInput = prompt("[ID]: ");
    }

    // Quaterynary Prompt -- Queue Type
    if (menuInput == 2 && firstInput == 4) {
      console.log(blue, "\nWhich game mode?");
      console.log("[1] - Conquest");
      console.log("[2] - Joust");
      console.log("[3] - Duel");
      fourthInput = prompt("[SELECTION]: ");
      if (!(fourthInput >= 1 && fourthInput <= 3)) {
        console.log(red, "\nERROR: Invalid option selected.\n");
        continue;
      }
      switch (fourthInput) {
        case '1': fourthInput = '451'; break;
        case '2': fourthInput = '450'; break;
        case '3': fourthInput = '451'; break;
      }
    }
    
    // Hande Input
    try {
      switch (menuInput) {
        case '1': {
          if (firstInput == '1') await getPlayer(1, secondInput, thirdInput);
          else if (firstInput == '2') await getFriends(1, secondInput, thirdInput);
          else if (firstInput == '3') await getMatchHistory(secondInput, thirdInput);
          else console.log(red, "\nERROR: Invalid option selected\n");
          break;
        }
        case '2': {
          if (firstInput == '1') await getInfo("gods", secondInput);
          else if (firstInput == '2') await getInfo("items", secondInput);
          else if (firstInput == '3') await getGodSkins(secondInput, thirdInput);
          else if (firstInput == '4') await getGodLeaderboard(secondInput, thirdInput, fourthInput);
          else console.log(red, "\nERROR: Invalid option selected\n");
          break;
        }
        case '3': {
          if (firstInput == '1') await getMOTD(secondInput);
          else if (firstInput == '2') await getMatchDetails(secondInput, thirdInput);
          else console.log(red, "\nERROR: Invalid option selected\n");
          break;
        }
        case '4': {
          if (firstInput == '1') await getHirezServerStatus(secondInput);
          else if (firstInput == '2') await getPatchInfo(secondInput);
          else if (firstInput == '3') await getDataUsed();
          else console.log(red, "\nERROR: Invalid option selected\n");
          break;
        }
        default: console.log(red, "\nERROR: Invalid option selected\n"); break;
      }
    } catch(e) { 
      console.log(red, '\nERROR: Unable to access API properly.\n\n')
      console.log(red, "\nERROR: " + e + "\nPlease report this bug to the developer.\n"); 
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

/*/////////////////////////////////////*/
/*/////////////////////////////////////*/
/*/////////////////////////////////////*/
/*/////////////////////////////////////*/
/*/////////////////////////////////////*/
/*////////// Primary Methods //////////*/

async function getInfo(info, code, flag) {
  
  const signature = md5(devId + "get" + info + authKey + getTimeStamp());
  console.log(cyan, "[API CALL]: /get" +info);
  
  let link = (smiteAPI + 'get' + info + 'json/' + devId + '/' + signature + '/' + sID + '/' + getTimeStamp() + '/' + '1')

  if (flag) {
    resp = await fetch(link);
    data = await resp.json();
    return data;
  }
  
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
}

// getDataUsed()

async function getDataUsed() {
  
  const signature = md5(devId + 'getdataused' + authKey + getTimeStamp());
  console.log(cyan, "[API CALL]: /getdataused");
  
  let link = smiteAPI + "getdatausedjson/" + devId + '/' + signature + '/' + sID + '/' + getTimeStamp();

  resp = await fetch(link);
  
  console.log(purple, "SESSION = " + sID);
  console.log(purple, "URL = " + link + '\n');
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
  
}

// getMOTD() /getmotd[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp

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

}

// getGodSkins() 

async function getGodSkins(code, god) {

  let godData = await getInfo('gods', null, 1);
  
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

}

// getMatchHistory() 

async function getMatchHistory(code, player) {
  
  const signature = md5(devId + 'getmatchhistory' + authKey + getTimeStamp());
  
  let link = smiteAPI + "getmatchhistoryjson/" + devId + '/' + signature + '/' + sID + '/' + getTimeStamp() + '/' + encodeURI(player);

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

  console.log(cyan, "[API CALL]: /getmatchhistory");
  if (code == 2 || code == 3) console.log(purple, "URL = " + link + '\n');

  if (code == 1 || code == 3) {
    output = JSON.stringify(data);
    fs.writeFile(player + "_match_history.json", output, function (err) {
        if (err) return console.log(red, err);
      })
    console.log(orange, player + "_match_history.json created successfully.\n");
  }

}

// getMatchDetails() 

async function getMatchDetails(code, match_id) {
  
  const signature = md5(devId + 'getmatchdetails' + authKey + getTimeStamp());
  
  let link = smiteAPI + "getmatchdetailsjson/" + devId + '/' + signature + '/' + sID + '/' + getTimeStamp() + '/' + match_id;

  try {
    resp = await fetch(link);
    data = await resp.json();
  }
  catch (e) {
    console.log(red, "\nERROR: Invalid match.\n");
    return;
  }

  console.log(cyan, "[API CALL]: /getmatchdetails");
  if (code == 2 || code == 3) console.log(purple, "URL = " + link + '\n');

  if (code == 1 || code == 3) {
    output = JSON.stringify(data);
    fs.writeFile(match_id + ".json", output, function (err) {
        if (err) return console.log(red, err);
      })
    console.log(orange, match_id + ".json created successfully.\n");
  }

}

/// getGodLeaderboard() /getgodleaderboard[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{godId}/{queue

async function getGodLeaderboard(code, god, queue) {

  let godId = null;

  let godData = await getInfo('gods', null, 1);
  for (let i = 0; i < godData.length; i++)
    if (godData[i].Name.toLowerCase() == god.toLowerCase())
      godId = godData[i].id;

  if (godId == null) {
    console.log(red, "\nERROR: Invalid God.\n");
    return;
  }
  
  const signature = md5(devId + 'getgodleaderboard' + authKey + getTimeStamp());
  
  let link = smiteAPI + "getgodleaderboardjson/" + devId + '/' + signature + '/' + sID + '/' + getTimeStamp() + '/' + godId + '/' + queue;

  try {
    resp = await fetch(link);
    data = await resp.json();
  }
  catch (e) {
    console.log(red, "\nERROR: Invalid God.\n");
    return;
  }

  console.log(cyan, "[API CALL]: /getgodleaderboard");
  if (code == 2 || code == 3) console.log(purple, "URL = " + link + '\n');

  if (code == 1 || code == 3) {
    output = JSON.stringify(data);
    fs.writeFile(god + '_' + queue + "_leaderboard.json", output, function (err) {
        if (err) return console.log(red, err);
      })
    console.log(orange, god + '_' + queue + "_leaderboard.json created successfully.\n");
  }

}