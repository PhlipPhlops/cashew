# cashew
An ExpressJS app using the Papaya repo to view patient images directly from the TCIA database.

## Notes

This is the original version of the app. A more recent version with different documenation and modified to be used with AWS Lambda can be found on the `lambda` branch of this repo. The Lambda version has different dependencies - specifically, the `node-minizip` module found in this version was replaced with a module that does not conflict with AWS Lambda the way `node-minizip` does.


## Setup

Run `npm install` to load the required dependencies, followed by `node app.js` to start app on `http://localhost:PORT` where port is an environment variable (defaults to 3000).

The TCIA api_key needs to be set as an environment variable with the name 'API_KEY'


## Usage

After the app begins listening, a SeriesInstanceUID can be given to the app through it's URL with the format `http://localhost:PORT/<SeriesInstanceUID>`. The images will be retrieved from the TCIA database and served to the user through Papaya.

Should an invalid SeriesInstanceUID be given, the user will be served a blank Papaya template.

Navigating to the root URL will serve the user the last images to be retrieved.


## How it works

The app is triggered when `GET` request is sent to the host with `SeriesInstanceUID` as a parameter. The app then sends a `GET` request to the TCIA `/getImage` API with the environment variable `API_KEY` and the user-input `SeriesInstanceUID` as query parameters. It pipes the response data into a zip file called `patientImages.zip` before unzipping its contents into the newly created `/papaya/data/patientData` directory.

After that's completed, the app "dives" into the `/papaya/data` directory and creates an array of paths to every `.dcm` file in the folder and all sub-folders. It takes this array and writes it to a file called `imageLoader.js` in the same folder as papaya's `index.html`. Papaya's `index.html` then uses this script to feed the images to papaya as the viewer begins loading. The layout of this array can be changed by modifying the function `outputToString()` in `diver.js`.