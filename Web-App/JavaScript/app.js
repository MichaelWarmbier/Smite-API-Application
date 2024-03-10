/*/// Data ///*/

let l_authKey = AuthKey;
let l_devId = DevId;
const smiteAPI = "https://api.smitegame.com/smiteapi.svc/";

let format = 'json';
let language = 1;
let sID = '';
let halted = false;
let Input_Buffer = '';
let Input_Passed = true;

/*/// Main ///*/

async function main() {
  await print_T("Smite API Application V1.3.0 (Web Version)", '#e8f531');
  await print_T("<a style='color:#767a38' href='https://github.com/MichaelWarmbier/Smite-API-Application/wiki'>Click here to view the Wiki", '#767a38');
  do {
    await print_T("", 'ERR');
    Input_Passed = false;
    await prompt("[Enter your Developer ID]")
    l_devId = Input_Buffer;
    await prompt("[Enter your Authentication Key]")
    l_authKey = Input_Buffer;

    await print_T("Attempting to establish connection with API..", '#767a38');
    try {
      let REQ = await fetch(`https://server-08-kirbout.replit.app/requestuniquesession?D=${l_devId}&K=${l_authKey}`);
      sID = await REQ.text();
      if (REQ.status === 500 || sID === '') throw new Error('');
    } catch (e) { await print_T("Error: Unable to verify credentials.", 'ERR'); continue; }

    Input_Passed = true;
  } while (!Input_Passed);

  await print_T("Session Established. Session will last 15 minutes.", '#34bf15');
  await print_T("Connected with Session: " + sID, '#34bf15');

  await print_T("", 'ERR');

  Input_Passed = false;
  do {
    await print_T("Main Menu", '#767a38');
    await print_T("[1] -- Player Methods");
    await print_T("[2] -- God and Item Methods");
    await print_T("[3] -- Match and Season Methods");
    await print_T("[4] -- Other Methods");
    await print_T("[5] -- Preferences");
    await print_T("[6] -- Credits");
    await prompt("[Make a Selection]");
    Input_Passed = await tryInputRange(1, 6);
  } while (!Input_Passed);
} main();

/*/// Methods ///*/

function tryInputRange(min, max) {
  return new Promise((resolve, reject) => {
    if (isNaN(parseInt(Input_Buffer)) || parseInt(Input_Buffer) < min || parseInt(Input_Buffer) > max ) {
      clear();
      print_T("Error: Incorrect option selected.", 'ERR');
      resolve(false);
    }
    resolve(true);
  });
}

function prompt(msg) {
  print_T(msg);
  return new Promise((resolve, reject) => {
    document.addEventListener('keyup', (event) => {
      if (event.key == 'Enter') setTimeout(() => { resolve()}, 400);
    });
  });
  return
}

// TEMPORARY
async function createSession() {
    let signature = await createSignature('createsession');
    return smiteAPI + "createsessionjson/" + l_devId + '/' + signature + '/' + getTimeStamp();
}

async function createSignature(methodName) {
    return md5(l_devId + methodName + l_authKey + getTimeStamp());
}

async function createLink(methodName, args) {
    let link = smiteAPI + methodName + format;
    for (let argIndex = 0; argIndex < args.length; argIndex++) 
      link += '/' + args[argIndex];
    return link;
}

async function retrieveAPIData(methodName, queue, targetName, tier) {

    if (queue != '') {
        switch (queue) {
            case '1': queue = '451'; break;
            case '2': queue = '450'; break;
            case '3': queue = '451'; break;
            case '4': queue = '426'; break;
            case '5': queue = '448'; break;
            case '6': queue = '435'; break;
            case '7': queue = '445'; break;
            case '8': queue = '10189'; break;
        }
    }

    let signature = await createSignature(methodName);
    let link = await determineLinkFormat(methodName, targetName, signature, queue, tier);
    if (!link) return;

    print_T('Creating endpoint: /' + methodName, '#8015ad');
  
    switch (methodName) {                                
      case 'getgodskins':
      case 'getgodrecommendeditems':
      case 'getgodleaderboard':
        // Need God Id
      break;
    }

    halted = true;
    setTimeout(() => {
        halted = false;
        print_T(`<a href='${link}' style='color:#11bf20' target='blank_'>Results Available</a>`, '#11bf20');
    }, 1000);
    
    
}

async function determineLinkFormat(methodName, targetName, signature, queue, tier) {
    let link = '';
    switch(methodName) {
      case 'getitems':
      case 'getgods':
        link = await createLink(methodName, [l_devId, signature, sID, getTimeStamp(), language]);
      break;
      case 'getplayerstatus':
      case 'getgodranks': 
      case 'getfriends': 
      case 'getmatchdetails': // Need id
      case 'getplayer': 
      case 'getmatchhistory':
      case 'getplayerachievements': // Doesn't work?
      case 'getplayeridbyname': 
        link = await createLink(methodName, [l_devId, signature, sID, getTimeStamp(), targetName]);
      break;
      case 'gethirezserverstatus':
      case 'getdataused':
      case 'getmotd':
      case 'gettopmatches':
      case 'getpatchinfo': // Must attach later
      case 'getesportsproleaguedetails':
        link = await createLink(methodName, [l_devId, signature, sID, getTimeStamp()]);
      break;
      case 'getgodskins': // needs id
      case 'getgodrecommendeditems': // needs id
        link = await createLink(methodName, [l_devId, signature, sID, getTimeStamp(), targetName, language]);
      break;
      case 'getgodleaderboard': // needs id
      case 'getqueuestats': // needs id
        link = await createLink(methodName, [l_devId, signature, sID, getTimeStamp(), targetName, queue]);
      break;
      case 'getleagueseasons':
        link = await createLink(methodName, [l_devId, signature, sID, getTimeStamp(), queue]);
      break;
      case 'getleagueleaderboard':
        link = await createLink(methodName, [l_devId, signature, sID, getTimeStamp(), queue, tier, targetName]);
      break;
      default: print_T('ERROR: Method does not exist. Please contact the developer', '#e32441');
    }
    return link;
}

function getTimeStamp() {
    const date = new Date();
    let year, month, day, hour, minute, second;
  
    year = date.getUTCFullYear();
    if (date.getUTCMonth() < 9) month = "0" + (date.getUTCMonth() + 1);
    else month = date.getUTCMonth() + 1;
    if (date.getUTCDate() < 10) day = "0" + date.getUTCDate();
    else day = date.getUTCDate();
    if (date.getUTCHours() < 10) hour = "0" + date.getUTCHours();
    else hour = date.getUTCHours();
    if (date.getUTCMinutes() < 10) minute = "0" + date.getUTCMinutes();
    else minute = date.getUTCMinutes();
    if (date.getUTCSeconds() < 10) second = "0" + date.getUTCSeconds();
    else second = date.getUTCSeconds();
  
    return "" + year + month + day + hour + minute + second;
}