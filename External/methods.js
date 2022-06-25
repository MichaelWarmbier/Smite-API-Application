require('./header.js');

////////////////////////////////
/*      Utility Methods       */
////////////////////////////////


/* Retrieves the current time and returns it in yyyyMMddhhmmss format. */
global.getTimeStamp = function getTimeStamp() {

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

/* Creates a session when credentials are entered. Session exists for the duration of the application. */
global.createSession = function createSession() {
  let signature = md5(devId + "createsession" + authKey + getTimeStamp());
  return smiteAPI + "createsessionjson/" + devId + '/' + signature + '/' + getTimeStamp();
}

///////////////////////////////////
/*      Readability Methods      */
///////////////////////////////////


/* Creates and returns a signature using the API required MD5-based algorithm */
global.createSignature = async function createSignature(methodName) {
  return md5(devId + methodName + authKey + getTimeStamp());
}

/* Displays a message informing the user that the API was called */
global.displayCall = async function displayCall(methodName) {
  console.log(cyan, "[API CALL]: /" + methodName);
}

/* Creates a link in the format required with optional arguments */
global.createLink = async function createLink(methodName, args) {
  let link = smiteAPI + methodName + 'json';
  for (let argIndex = 0; argIndex < args.length; argIndex++) 
    link += '/' + args[argIndex];
  return link;
}

/* Retrieves data and returns it as a JavaScript object */
global.fetchData = async function fetchData(link) {
  try {
    resp = await fetch(link);
    data = await resp.json();
  } catch (e) { throw 'ERROR: Unable to fetch inforamation.'; }

  if (data[0].ret_msg != null && data[0].ret_msg.includes('Privacy')) 
  { throw 'ERROR: Player profile set to private.'; return; }
  
  if (data[0] == null)
  { throw 'ERROR: Invalid information (God Name / Player Name / Match ID)'; return; }

  return data;
}

/* Determines how to handle the data after retrieval */
global.handleData = async function handleData(data, selection, link, methodName, specifics) {

  let fileName = methodName + '_' + getTimeStamp() + '_' + specifics + '_.json';

  if (methodName == 'getplayerstatus') {
    console.log(green, '\nPlayer Status: ' + data[0].status_string + '\n');
    return;
  }

  if (methodName == 'getdataused') selection = 2;
  
  if (selection == 2 || selection == 3) 
    console.log(purple, "URL = " + link + '\n');

  if (selection == 1 || selection == 3) {
    output = JSON.stringify(data);
    fs.writeFile(fileName, output, function (err) {
        if (err) return console.log(red, '\nERROR: Unable to create file\n');
        else console.log(cyan, fileName + " created successfully.\n");
      })
  }

}

/* Determine the format the link should be in depending on which method is called */
global.determineLinkFormat = async function determineLinkFormat(methodName, targetName, signature, queue) {
  let link = '';
  switch(methodName) {
    case 'getitems':
    case 'getgods':
      link = await createLink(methodName, [devId, signature, sID, getTimeStamp(), '1']);
    break;
    case 'getplayerstatus':
    case 'getgodranks':
    case 'getfriends':
    case 'getmatchdetails':
    case 'getplayer':
    case 'getmatchhistory':
    case 'getplayerachievements':
      link = await createLink(methodName, [devId, signature, sID, getTimeStamp(), targetName]);
    break;
    case 'gethirezserverstatus':
    case 'getdataused':
    case 'getpatchinfo':
    case 'getmotd':
    case 'gettopmatches':
    case 'getpatchinfo':
    case 'getesportsproleaguedetails':
      link = await createLink(methodName, [devId, signature, sID, getTimeStamp()]);
    break;
    case 'getgodskins':
    case 'getgodrecommendeditems':
      link = await createLink(methodName, [devId, signature, sID, getTimeStamp(), targetName, '1']);
    break;
    case 'getgodleaderboard':
    case 'getqueuestats':
      link = await createLink(methodName, [devId, signature, sID, getTimeStamp(), targetName, queue]);
    break;
    case 'getleagueseasons':
      link = await createLink(methodName, [devId, signature, sID, getTimeStamp(), queue]);
    break;
    default: throw 'ERROR: Method does not exist. Please contact the developer';
  }
  return link;
}

/* Retrieve a specific gods ID */
global.retrieveGodID = async function retrieveGodID(godName) {
  let godId = '';
  let gods = await retrieveAPIData('getgods', 4, 0, null);
  for (let i = 0; i < gods.length; i++)
    if (gods[i].Name.toLowerCase() == godName.toLowerCase())
      godId = gods[i].id;
  return godId;
}

/* Retrieve a specific players ID */
global.retrievePlayerID = async function retrievePlayerID(playerName) {
  let player = await retrieveAPIData('getplayer', 4, 0, 'kirbout');
  playerId = player[0].Id;
  return playerId;
}