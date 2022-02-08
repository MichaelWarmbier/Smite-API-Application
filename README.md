# Smite-API-Application
A Node.js based application designed to provide a basic CLI interface that allows user to access the Smite API (with their own provided credentials) and retrieve information without going through the process of coding their own wrappers and applications.

**Current Version:** Beta 1.0

### Table of Contents

- [Smite-API-Application](#smite-api-application)
  * [Information](#information)
  * [FAQ](#faq)
  * [Planned Features](#planned-features)
  * [Installation](#installation)
    + [Install Node.js](#install-nodejs)
    + [Windows](#windows)
    + [Linux](#linux)
  * [Using application through Repl.it](#using-the-application-through-replit)
  * [Using the application](#using-the-application)

## Information

Originally intended to be a personal application used for another one of my projects, I now have plans to actually expand it into a complete and public tool. Project still in development.

In order to use this application, you must have developer credentials provided by Hi-Rez for use with this API. See [Using The Application](#using-the-application) for more information.

Utilizes the following packages:

* [md5](https://www.npmjs.com/package/md5) - Hashing algorithm
* [node-fetch](https://www.npmjs.com/package/node-fetch) - API access
* [prompt-sync](https://www.npmjs.com/package/prompt-sync) - Input prompting
* [fs](https://www.npmjs.com/package/fs) - Creating files

## FAQ

**Q.** There are bugs and/or missing features that I would appreciate being added, what should I do?

**A.** Any questions, concerns or issues can be reported to me on the official GitHub repository's [issue page](https://github.com/MichaelWarmbier/Smite-API-Application/issues). You can also email me for better results at business@michaelwarmbier.com.

---

**Q.** My name contains special characters and won't work, what do I do?

**A.** The easiest way to deal with this is to type in a dummy name during the "Name of player you wish to use" prompt, then to edit the URL manually by changing the name at the end. I'm currently working on a workaround to this, so this answer will be changed.

## Planned Features

The following API methods are planned to be implemented in the future:

/getfriends<br>
/getgodranks<br>
/getgodleaderboard<br>
/getgodskins<br>
/getgodrecommendeditems<br>
/getmatchdetails<br>
/getleagueleaderboard<br>
/getleagueseasons<br>
/getmatchhistory<br>
/getplayerstatus<br>
/getqueuestats<br>
/gettopmatches<br>
/getplayerachievements<br>

## Installation

### Install Node.js

Node can be installed on **Windows** by going to the [download page](https://nodejs.org/en/).

Node can be installed on **Linux** by running the following command on the terminal:

`sudo apt install nodejs`

Sudo gives elevated priviledges to the shell and thus will require your user password.

### Windows

Download the repository as a .zip file and extract its contents to a preferred location.

Locate the smite-api.js file. Right click on the file, click on "Open With", then select Node.js JavaScript Runtime. You may also want to tell Windows to always open files with the .js extension using Node.

### Linux

Download the repository as a .zip file and extract its contents to a preferred location. Navigate to that location using the terminal and run it with the following command:

`node smite-api.js`

## Using the application through Repl.it

Visit [this location](https://replit.com/@Kirbout/Smite-API-Application) and run the application that way.

## Using the application

Your DevID and your Authentication Key which can be received by registering as an API developer through Smite themselves are required to use this application. A link to the documentation can be found [here](https://webcdn.hirezstudios.com/hirez-studios/legal/smite-api-developer-guide.pdf).

Keep in mind that every time the application is run and the user is logged in, a new session is established that will go towards the API limits. Sessions typically have a duration of 15 minutes.

Following the prompt on screen and make your selection. For most options, a second prompt will appear asking if you want to receive the return as a link, a file or both.

If you run this application through Repl, you may have to fork the project before you can access the output files.

**NOTE**: This application currently _only supports_ Smite on PC.

### Currently supported API calls:

**/gethirezserverstatus** - Outputs link of and/or downloads JSON data relating to the concurrent status of the Hi-Rez Smite servers on all platforms. Saves files with timestamp. <br>

**/getdataused** - Outputs link to JSON data relating to the API limits associated with the provided devId. <br>

**/getitems** - Outputs link of and/or downloads JSON data relating to the current patch version for items within the game. <br>

**/getgods** - Outputs link of and/or downloads JSON data for the Gods within the game.<br>

**/getplayer** - Outputs link of and/or downloads JSON data relating to a specific player. <br>

**/getpatchinfo** - Outputs link of and/or downloads JSON data relating to the current patch version for the Smite game.

**/getmotd** - Outputs link of and/or downloads JSON data relating to the twenty most recent modes of the day.