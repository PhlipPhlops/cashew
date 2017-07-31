# cashew
A viewer app to be linked with TCIA database

When launched, a SeriesInstanceUID can be given to the app through the URL with the format "http://hostName/(SeriesInstanceUID)", after which papaya will serve the images from the TCIA database to the user

The api key needs to be set as a node environment variable with the name 'API_KEY'