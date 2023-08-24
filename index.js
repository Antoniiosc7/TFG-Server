const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors()); // This enables CORS for all routes
const port = process.env.PORT || 80;


app.use("/",express.static('public'));

app.listen(port, () => {
    console.log(`Server ready at port ${port}`);
});

var Datastore = require('nedb'),    
db_tennis = new Datastore();
db_tennis2 = new Datastore();

const tennis_API = require("./src/tennis.js");
tennis_API.register(app,db_tennis);

const tennis_APIv2 = require("./src/tennisv2.js"); 
tennis_APIv2.register(app,db_tennis2);

const twitch = require("./src/tennistwitch.js");
twitch.register(app);

db_premier = new Datastore();
const premierAPI = require("./src/premier-league.js"); 
premierAPI.register(app,db_premier);

const tennislivedata = require("./src/tennislivedata");
tennislivedata.register(app);

const tennisWomen = require("./src/tennisWomen");
tennisWomen.register(app);

db_nba_stats2 = new Datastore();
const nbaStats_API_v2 = require("./src/nba-stats_v2");
nbaStats_API_v2.register(app,db_nba_stats2);
