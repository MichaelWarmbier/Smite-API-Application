#!/usr/bin/env node

/////////////////////////////////////////////////////////////
/* Application created by Michael Warmbier. Copyright 2022 */
/////////////////////////////////////////////////////////////

require('./External/wrapper.js');

main();

async function main() {

  let Input_0 = '';
  let Input_1 = '';
  let Input_2 = '';
  let Input_3 = '';
  let Input_4 = '';
  let Input_5 = '';
  let menuData = '';
  let validInput = false;
  
  console.log(green, "Smite API Application V1.2.1");
  console.log(orange, "Use ctrl + c to exit at any time.");
  console.log(orange, "See wiki for help: https://tinyurl.com/4zh5pmm4\n");

  do {
    
    // Prompt the user to login
    console.log("Enter your developer ID or Login: "); 
    devId = prompt('[LOGIN]: ');
    console.log('Enter your authentication key or Password: ');
    authKey = prompt('[PASSWORD]: ');
  
    // Verify ownership (Replit use)
    if (devId == username && authKey == password) {
      console.log(green, "Successfully logged in as owner.");
      devId = s_devId;
      authKey = s_authKey;
    }

    if (devId == saveData.Login && authKey == saveData.Password) {
      console.log(green, "Successfully logged in with custom credentials.");
      devId = saveData.DevId;
      authKey = saveData.AuthKey;
    }

    // Verify login
    try {
      let resp = await fetch(createSession());
      menuData = await resp.json();
    } catch (e) {
      console.log(red, "\nERROR: API unresponsive.\n");
    }
    if (menuData.ret_msg == "Approved") {
      sID = await menuData.session_id;
      validInput = true;
    }
    else if (menuData != null)
      console.log(red, "\nERROR: Invalid credentials.\n")
    
  } while(!validInput) 

  console.log(green, "\nSession established.");
  console.log(red, "\n[WARNING]: New session will\nneed to be established in 15 minutes.\n")
  console.log(blue, "Pinging server..");

  do {
  
    // Ping server
    resp = await fetch("https://api.smitegame.com/smiteapi.svc/pingjson");
    menuData = await resp.json();
    console.log(orange, '\n' + menuData);
    console.log(orange, '[Platform]: ' + platform)
    let displayLanguage = '';
    switch (language) {
      case 1: displayLanguage = 'English'; break;
      case 2: displayLanguage = 'German / Deutsch'; break;
      case 3: displayLanguage = 'French / Français'; break;
      case 5: displayLanguage = 'Chinese / 中国人'; break;
      case 7: displayLanguage = 'Spanish / Español'; break;
      case 9: displayLanguage = 'Latin American Spanish / Español latinoamericano'; break;
      case 10: displayLanguage = 'Portugese / Português'; break;
      case 11: displayLanguage = 'Russian / Русский'; break;
      case 12: displayLanguage = 'Polish / Polskie'; break;
      case 13: displayLanguage = 'Turkish / Turecki'; break;
    }
    console.log(orange, '[RETURN LANGUAGE]: ' + displayLanguage);

    if (menuData.indexOf("Ping successful") == -1) 
      console.log(red, "Ping unsuccessful. Unable to access SmiteAPI");

    // Prompt user with menu
    console.log(blue, "\nEnter which menu?");
    console.log("[1] - Player Methods");
    console.log("[2] - God and Item Methods");
    console.log("[3] - Match and Season Methods")
    console.log("[4] - Other Methods");
    console.log("[5] - Options");
    console.log("[6] - Credits");
    Input_0 = prompt("[SELECTION]: ");

    if (Input_0 >= 1 && Input_0 <= 6) {
      if (Input_0 != 6) console.log(blue, "\nRun which of the following commands?");
    }
    else {
      console.log(red, "\nERROR: Invalid option selected.\n");
      continue;
    }
    switch (Input_0) {
      case '1': {
        console.log("[b] - Go Back");
        console.log("[1] - Get Player's Information");
        console.log("[2] - Get List of Player's Friends/Blocked");
        console.log("[3] - Get Player's Match History");
        console.log("[4] - Get Player's Current Status");
        console.log("[5] - Get Player's God Ranks");
        console.log("[6] - Get Player's Achievements");
        console.log("[7] - Get Player's Game Mode Specific Stats");
        break;
      }
      case '2': {
        console.log("[b] - Go Back");
        console.log("[1] - Get All God Information");
        console.log("[2] - Get All Item Information");
        console.log("[3] - Get A God's Skin Information");
        console.log("[4] - Get A God's Ranked Leaderboard Information");
        console.log("[5] - Get A God's Recommended Items");
        break;
      }
      case '3': {
        console.log("[b] - Go Back");
        console.log("[1] - Get MOTD Information");
        console.log("[2] - Get A Specific Match's Details");
        console.log("[3] - Get Recent Top Match Information");
        console.log("[4] - Get Current Pro League Statistics");
        console.log("[5] - Get This Ranked Seasons Rounds");
        console.log("[6] - Get A Game Mode's Ranked Leaderboard");
        break;
      }
      case '4': {
        console.log("[b] - Go Back");
        console.log("[1] - Get Current Servers' Status");
        console.log("[2] - Get Current Patch's Info");
        console.log("[3] - Get Your Data Used");
        break;
      }
      case '5': {
        console.log(red, '\n[WARNING]: If you\'re accessing this app through npx, these options will have no effect and may even cause errors.\n')
        console.log("[b] - Go back");
        console.log("[1] - Set Custom Login");
        console.log("[2] - Set Custom Download Path");
        console.log("[3] - Set Return Language (for supported methods)")
        break;
      }  
      case '6': displayCredits(); continue; break;
    }
    Input_1 = await prompt("[SELECTION]: ");
    if (Input_1 == 'b') continue;

    // Update Login Prompt
    if (Input_0 == '5' && Input_1 == '1') {
      
      console.log(blue, '\nEnter a username:');
      Input_0 = prompt('[USERNAME]: ');
      console.log(blue, '\nEnter a password:');
      Input_1 = prompt('[PASSWORD]: ');
      
      saveData.Login = Input_0;
      saveData.Password = Input_1;
      saveData.DevId = devId;
      saveData.AuthKey = authKey;
      
      fs.writeFile('./External/save_data.json', JSON.stringify(saveData), function (err) {
        if (err) return console.log(red, '\nERROR: Invalid credential names.\n');
        else console.log(cyan, '\nCredentials updated. You may now use them to login.');
      });
      continue;
    }

    // Update Save Directory Prompt
    if (Input_0 == '5' && Input_1 == '2') {

      console.log(blue, '\nEnter a new directory to save to:');
      Input_0 = prompt('[PATH]: ');

      saveData.TargetLocation = Input_0;

      if (fs.existsSync(Input_0)) {
        fs.writeFile('./External/save_data.json', JSON.stringify(saveData), function (err) {
          if (err) return console.log(red, '\nERROR: Unable to update save data');
          else console.log(cyan, '\nDirectory updated. Files will now save to ' + Input_0);
        });
      }
      continue;
    }

    // Update Return Language
    if (Input_0 == '5' && Input_1 == '3') {

      console.log(blue, '\nSelect a language:');
      console.log("[1] - Set Custom Login");
      console.log("[2] - German / Deutsch");
      console.log("[3] - French / Français");
      console.log("[4] - Chinese / 中国人");
      console.log("[5] - Spanish / Español");
      console.log("[6] - Latin American Spanish / Español latinoamericano");
      console.log("[7] - Portugese / Português");
      console.log("[8] - Russian / Русский");
      console.log("[9] - Polish / Polskie");
      console.log("[10] - Turkish / Turecki");
      Input_0 = prompt('[SELECTION]: ');
      
      switch (Input_0) {
        case '1': language = 1; break;
        case '2': language = 2; break;
        case '3': language = 3; break;
        case '4': language = 5; break;
        case '5': language = 7; break;
        case '6': language = 9; break;
        case '7': language = 10; break;
        case '8': language = 11; break;
        case '9': language = 12; break;
        case '10': language = 13; break;
        default: console.log(red, '\nERROR: Invalid option selected.\n');
      }
      saveData.Language = language;
      
      fs.writeFile('./External/save_data.json', JSON.stringify(saveData), function (err) {
        if (err) return console.log(red, '\nERROR: Unable to update save data.\n');
        else console.log(cyan, '\nReturn language updated.');
      });
      continue;
    }

    if (Input_0 != 5 &&!(Input_0 == 4 && Input_1 == '3') 
        && !(Input_0 == 1 && Input_1 == '4')) {
      
      // Secondary Prompt; use selects what to do with data
      console.log(blue, "\nChoose one of the following:");
      console.log("[1] - Save as File");
      console.log("[2] - Output as Link");
      console.log("[3] - Both");
      Input_2 = prompt("[SELECTION]: ");
      if (Input_2 > 3 || Input_2 < 1) Input_1 = -1;
    }

    // Tertiary prompt; user enters a playername
    if (Input_0 == 1) {
      console.log (blue, "\nEnter the name of the player:")
      Input_3 = prompt("[NAME]: ");
    }

    // Tertiary Prompt; user enters a God name
    if (Input_0 == 2 && (Input_1 == 3 || Input_1 == 4 || Input_1 == 5)) {
      console.log (blue, "\nEnter the name of the God:")
      Input_3 = prompt("[NAME]: ");
    }

    // Tertiary Prompt; user enters a match id number
    if (Input_0 == 3 && Input_1 == 2) {
      console.log(orange, "\nGo to [Player Methods > Get Player Match History] to get recent match IDs.");
      console.log(red, "WARNING: Method may be slow, please be patient.");
      console.log (blue, "Enter the match ID:")
      Input_3 = prompt("[ID]: ");
    }

    // Quaternary Prompt; user selects a game mode to pass to API call
    if ((Input_0 == 2 && Input_1 == 4) || 
        (Input_0 == 1 && Input_1 == 7) || 
        (Input_0 == 3 && Input_1 == 5) ||
        (Input_0 == 3 && Input_1 == 6)) {
      console.log(blue, "\nWhich game mode?");
      console.log("[1] - Ranked Conquest");
      console.log("[2] - Ranked Joust");
      console.log("[3] - Ranked Duel");
      if (Input_0 != 2 && (Input_0 != 3 && Input_1 != 6)) {
        console.log("[4] - Conquest");
        console.log("[5] - Joust");
        console.log("[6] - Arena");
        console.log("[7] - Assault");
      }
      Input_4 = prompt("[SELECTION]: ");
      if (((Input_0 == 2) || (Input_0 == 3 && Input_1 == 6) 
           && !(Input_4 >= 1 && Input_4 <= 3)) ||
          (Input_0 == 1 && !(Input_4 >= 1 && Input_4 <= 7))) {
        console.log(red, "\nERROR: Invalid option selected.\n");
        continue;
      }
      switch (Input_4) {
        case '1': Input_4 = '451'; break;
        case '2': Input_4 = '450'; break;
        case '3': Input_4 = '451'; break;
        case '4': Input_4 = '426'; break;
        case '5': Input_4 = '448'; break;
        case '6': Input_4 = '435'; break;
        case '7': Input_4 = '445'; break;
      }
    }

    // Quinary Prompt; user selects a tier
    if (Input_0 == 3 && Input_1 == 6) {
      menuData = await retrieveAPIData('getleagueseasons', 4, Input_4, null);
      menuData = menuData.length;
      do {
        console.log(blue, '\nPlease select a rank:')
        console.log('[1] - Bronze')
        console.log('[2] - Silver')
        console.log('[3] - Gold')
        console.log('[4] - Platinum')
        console.log('[5] - Diamond')
        console.log('[6] - Masters')
        console.log('[7] - Grandmasters')
        Input_5 = await prompt("[SELECTION]: ");
        if (Input_5 == 7) Input_5 = 27;
        else if (Input_5 == 6) Input_5 = 26;
        else {
          console.log(blue, '\nPlease select a tier:')
          console.log('[1] - Tier V')
          console.log('[2] - Tier IV')
          console.log('[3] - Tier III')
          console.log('[4] - Tier II')
          console.log('[5] - Tier I')
          Input_5 = (Input_5 - 1) * 5 + parseInt(await prompt("[SELECTION]: "));
        }
        if (Input_5 >= 1 && Input_5 <= 27) break;
        else console.log(red, "\nERROR: Invalid option selected\n");
      } while (true);
    }
    
    // Input is handled and API is called
    try {
      switch (Input_0) {
        case '1': {
          switch (Input_1) {
            case '1': await retrieveAPIData('getplayer', Input_2, 0, Input_3); break;
            case '2': await retrieveAPIData('getfriends', Input_2, 0, Input_3); break;
            case '3': await retrieveAPIData('getmatchhistory', Input_2, 0, Input_3); break;
            case '4': await retrieveAPIData('getplayerstatus', Input_2, 0, Input_3); break;
            case '5': await retrieveAPIData('getgodranks', Input_2, 0, Input_3); break;
            case '6': await retrieveAPIData('getplayerachievements', Input_2, 0, Input_3); break;
            case '7': await retrieveAPIData('getqueuestats', Input_2, Input_4, Input_3); break;
            default: console.log(red, '\nERROR: Invalid option selected\n');
          }
          break;
        }
        case '2': {
          switch (Input_1) {
            case '1': await retrieveAPIData('getgods', Input_2, 0, null);  break;
            case '2': await retrieveAPIData('getitems', Input_2, 0, null);  break;
            case '3': await retrieveAPIData('getgodskins', Input_2, 0, Input_3); break;
            case '4': await retrieveAPIData('getgodleaderboard', Input_2, Input_4, Input_3); break;
            case '5': await retrieveAPIData('getgodrecommendeditems', Input_2, 0, Input_3); break;
            default: console.log(red, '\nERROR: Invalid option selected\n');
          }
          break;
        }
        case '3': {
          switch (Input_1) {
            case '1': await retrieveAPIData('getmotd', Input_2, 0, null); break;
            case '2': await retrieveAPIData('getmatchdetails', Input_2, 0, Input_3); break;
            case '3': await retrieveAPIData('gettopmatches', Input_2, 0, null); break;
            case '4': await retrieveAPIData('getesportsproleaguedetails', Input_2, 0, null); break;
            case '5': await retrieveAPIData('getleagueseasons', Input_2, Input_4, null); break;
            case '6': await retrieveAPIData('getleagueleaderboard', Input_2, Input_4, menuData, Input_5); break;
            default: console.log(red, '\nERROR: Invalid option selected\n');
          }
          break;
        }
        case '4': {
          switch (Input_1) {
            case '1': await retrieveAPIData('gethirezserverstatus', Input_2, 0, null); break;
            case '2': await retrieveAPIData('getpatchinfo', Input_2, 0, null); break;
            case '3': await retrieveAPIData('getdataused', Input_2, 0, null); break;
            default: console.log(red, '\nERROR: Invalid option selected\n');
          }
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
