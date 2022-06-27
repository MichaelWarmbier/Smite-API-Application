/////////////////////
/*      Data       */
/////////////////////

/* Node Packages */
md5 = require('md5');
fetch = require('node-fetch'); 
prompt = require('prompt-sync')({sigint: true}); 
fs = require('fs'); 
saveData = require('./save_data.json');

/* Secrets (Replit use) */
global.username = process.env['usrname'];
global.password = process.env['pswd'];
global.s_devId = process.env['devID']
global.s_authKey = process.env['key']
 
/* Colors */
global.orange = "\x1b[33m%s\x1b[0m";
global.green = "\x1b[32m%s\x1b[0m";
global.blue = "\x1b[34m%s\x1b[0m";
global.red = "\x1b[31m%s\x1b[0m";
global.purple = "\n\x1b[35m%s\x1b[0m";
global.cyan = "\n\x1b[36m%s\x1b[0m"

/* Variables */
global.smiteAPI = "https://api.smitegame.com/smiteapi.svc/";
global.platform = "PC";
global.language = saveData.Language;
global.input = null; 
global.devId = null; 
global.authKey = null;
global.sID = null;