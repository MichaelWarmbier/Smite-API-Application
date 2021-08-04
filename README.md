# Smite-API-Application
A Node based application designed to make accessing the Smite API easier.

## Using application through Repl.it

Visit [this location](https://replit.com/@Kirbout/Smite-API-Application) to view the repository for this function on replit.com

On the right-side preivew screen, select either the **console** or the **shell** option and enter the following command:

`node smite-api.js` 

Then, use the program like normally. Updated files will be located in the output folder.

## Installation

These are the current steps while I figure out how to use npm to streamline the process through the console or terminal.

### Install Node.js

Node can be installed on **Windows** by going to the [download Page](https://nodejs.org/en/)

Node can be installed on Ubuntu Linux by running the following command on the terminal:

`sudo apt install nodejs`

You may need to enter in your user password due to the sudo command.

### Windows

Download the repository as a .zip file and extract it's contents to a preferred location.

Locate the smite-api.js file. Right click on the file, click on "Open With", then select Node.js JavaScript Runtime. You may also want to set Windows to always open files with the .js extension using Node.

### Linux

Download the repository as a .zip file and extract it's contents to a preferred location. Navigate to that location using the terminal and run it with the following command:

`node smite-api.js`

### Using the application

Currently, there are only two prompts to fill out. Your DevID and your Authentication Key which can be received by registering as an API developer through Smite themselves. A link to the documentation can be found [here](https://webcdn.hirezstudios.com/hirez-studios/legal/smite-api-developer-guide.pdf)

Additionally, if you run smite-api from the file and not the console or terminal directly, the application will close as soon as it's finished. This will be fixed in a later update.

Right now the only information this tool can access are the gods and items information, which it saves as gods.json and items.json next adjacent to smite-api.js More updates are planned in the future for the rest of the API as well as minor quality of life improvements. So far, this has only been tested to work on Ubuntu based Linux distros and Windows 10.
