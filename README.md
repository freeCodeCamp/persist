# NYC Outward Bound 

### Description

An open source data management tracking system originally built for NYC outward bound
to allow them to track their leavers.

### Running For the First Time

 #### Prerequisites
   * Make sure mongodb server is installed and running

 #### Start server
   * cd into the project directory
   * Run `npm i` to install dependencies
   * Run - `cp sample.env .env` and fill env values in **.env** file (MONGODB_URI value for development could be - "mongodb://localhost:27017/")
   * Start server - npm run watch


#### Notes:-
 * Use node < 7, for node-inspector to work properly (See:- https://github.com/node-inspector/v8-debug/issues/33)

