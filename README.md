# cashew - Lambda Version
A patient image viewing ExpressJS app to be linked with the TCIA database - modified to be integrated with AWS Lambda. For a local (and functional) version, check out the master branch.

### WARNING: This version has code in it that modifies the `/tmp` directory of its host machine. It's written to be run specifically on AWS Lambda.

## Setup

To setup the app for Lambda, run `npm install` to fetch the dependencies listed in the package.json.

Three scripts are included in the package: `create`, `test`, and `deploy`. These scripts utilize Claudia.js, an alternative command line interface for AWS Lambda.

In order to upload this package as your own Lambda function, first follow the instructions at `https://claudiajs.com/tutorials/installing.html` to make sure your AWS credentials are setup. Inside of package.json, update the scripts `create` and `deploy` to include your own TCIA API key as an environment variable "`API_KEY`". You can do this by appending `--set-env API_KEY=<Your_API_key>` to the script.

`"deploy": "claudia update --handler lambda.handler --deploy-proxy-api --region us-east-1 --timeout 30 --set-env API_KEY=XXXXxxX-XxXXX-xxXX-xXXx-XXXxXXXxXXxXX"`

Now you should be able to upload the function using `npm run create`, and upload any further updates using `npm run deploy`.

For more information about these scripts and their layout, check out `https://github.com/claudiajs/claudia/blob/master/docs/create.md`.

Logs for the function can be found in the AWS CloudWatch console, under the function name 'lambda_cashew'.


## Usage

When launched, a SeriesInstanceUID can be given to the app through the URL with the format `http://hostName/<SeriesInstanceUID>`, after which the code will execute. Papaya will attempt to serve the images from the TCIA database to the user.

The api key needs to be set as a node environment variable with the name 'API_KEY'


## How it works

The app is triggered when `GET` request is sent to the Lambda gateway with a `SeriesInstanceUID` as a parameter. First, the app deletes the `/tmp/papaya` directory to take care of any caching issues leftover from a previous function call. It then copies its own `/papaya` directory to `/tmp/papaya`. This is because the app relies on file manipulation, and the `/tmp` directory is the only directory that Lambda gives write access to.

After the folders are copied and subsequent data output directories are created, the app sends a `GET` request to the TCIA `/getImage` API with the environment variable `API_KEY` and the user-input `SeriesInstanceUID` as query parameters. It pipes the response data into a zip file called `patientImages.zip` before unzipping its contents into the newly created `/papaya/data/patientData` directory.

After that's completed, the app "dives" into the `/papaya/data` directory and creates an array of paths to every `.dcm` file in the folder and all sub-folders. It takes this array and writes it to a file called `imageLoader.js` in the same folder as papaya's `index.html`. Papaya's `index.html` then uses this script to feed the images to papaya as the viewer begins loading. The layout of this array can be changed by modifying the function `outputToString()` in `diver.js`.

Currently the images are not being properly fed to papaya.