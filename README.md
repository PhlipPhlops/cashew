# cashew
An app using the Papaya repo to view patient images directly from the TCIA database.

Run `node app.js` to start app on `http://localhost:PORT` where port is an environment variable (defaults to 3000).

After the app begins listening, a SeriesInstanceUID can be given to the app through it's URL with the format `http://localhost:PORT/<SeriesInstanceUID>`. The images will be retrieved from the TCIA database and served to the user through Papaya.

Should an invalid SeriesInstanceUID be given, the user will be served a blank Papaya template.

Navigating to the root URL will serve the user the last images to be retrieved.

The TCIA api_key needs to be set as an environment variable with the name 'API_KEY'