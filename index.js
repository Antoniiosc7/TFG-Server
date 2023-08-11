const express = require("express");
const app = express();

const port = process.env.PORT || 8082;


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