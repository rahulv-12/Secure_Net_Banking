// Require Packages
const express = require('express');
const bodyParser = require('body-parser');
var fs = require('fs');
const bcrypt = require("bcrypt");
const cors = require("cors");

const port = process.env.PORT || 6060;      // Set Port
const app = express();                      // Use Express
app.use(express.json());


const path = require("path");


app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.text());
app.use(express.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;

app.get('/hi', (request, response) => {
    console.log('Hello Home!');
    response.send("Hello World!");
});

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve Users Json
var url = "mongodb://localhost:27017/";
app.get('/json', function (req, res) {
    var queryres = null;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("banking");
        dbo.collection("banks").find({}, {projection: {user: 1}}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            queryres = result;
            db.close().then(r => {
                res.send(queryres);
            });
        });
    });
});

app.get('/currentuser', function (req, res) {
    var queryres = null;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("banking");
        dbo.collection("banks").find({current: "true"}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            queryres = result;
            db.close().then(r => {
                res.send(queryres);
            });
        });
    });
});


const accountSid ="AC113295fa3791bdabf1c0df6f873ad096";
const authToken = "8381b59ae39caef51b222d2a2e74895c";
const client = require('twilio')(accountSid, authToken);

app.get('/verifyuser', function (req, res) {
    var queryres;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("banking");
        dbo.collection("banks").find({current: "true"}).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result);
            queryres = result;
            db.close().then(r => {
                var mail = queryres[0]['mail'];
                var mobile = queryres[0]['mobile'];

                client.verify.services.create({friendlyName: 'Secured Net Banking'})
                    .then(service => {
                        console.log("sample", service.sid)
                        var sid = service.sid;
                        client.verify.services(sid)
                            .verifications
                            .create({to: "+91" + mobile, channel: 'sms'})
                            .then(verification =>   {
                                console.log(verification.status)
                                //res.send(verification.status);
                                var tmp = {vid: sid, mobile: mobile, status: "pending"};
                                console.log('tmp', tmp);
                                res.send(tmp);
                            });
                    });
            });
        });
    });
});

app.post('/otp', function (req, res) {
    var otp = req.body['otp'];
    var vid = req.body['vid'];
    var mobile = req.body['mobile'];
    console.log('otp', otp, vid, mobile);
    client.verify.services(vid)
        .verificationChecks
        .create({to: '+91' + mobile, code: otp})
        .then(verification_check => {
            console.log(verification_check.status)
            res.send(verification_check.status);
            return verification_check.status;
        }).then(status => {
        if (status === 'approved') {
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("banking");
                var myquery = {current: "true"};
                var newvalues = {$set: {verified: "true"}};
                dbo.collection("banks").updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    db.close();
                });
            });
        }
    });
});

app.post('/mpin', async function (req, res) {
    var pin = req.body['pin'];
    const salt = await bcrypt.genSalt(10);
    var mpin = await bcrypt.hash(pin, salt);
    console.log(mpin);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("banking");
        var myquery = {current: "true"};
        var newvalues = {$set: {mpin: mpin}};
        dbo.collection("banks").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
    res.send(true);
})

// Handle Login
app.post('/login', function (req, res) {
    var user = req.body['user'];
    var pass = req.body['password'];
    //console.log(req.body);
    var queryres = null;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("banking");
        dbo.collection("banks").find({user: user}, {projection: {password: 1}}).toArray(async function (err, result) {
            if (err) {
                res.send(false);
                throw err;
            }
            queryres = result;
            var mypass = queryres[0]['password'];
            const validPassword = await bcrypt.compare(pass, mypass);
            if (validPassword) {
                console.log(validPassword, mypass);
                res.send(true);
            } else {
                console.log(validPassword, mypass);
                res.send(false);
            }
            db.close();
        });
    });
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("banking");
        var myquery = {user: user};
        var newvalues = {$set: {current: "true"}};
        dbo.collection("banks").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
});

// Handle Logout
app.get('/logout', function (req, res) {
    var name = "";
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("banking");
        var myquery = {current: "true"};
        var newvalues = {$set: {current: "false"}};
        dbo.collection("banks").find(myquery, {projection: {user: 1}}).toArray(async function (err, result) {
            if (err) {
                res.send(false);
                throw err;
            }
            name = result[0]['user'];
        });
        dbo.collection("banks").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
    res.send(name);
});


// Handle User Signup
app.post('/signup', async function (req, res) {
    var redt = req.body;
    var pass = redt['password'];
    const salt = await bcrypt.genSalt(10);
    redt['password'] = await bcrypt.hash(pass, salt);
    console.log('signup', req.body);

    var queryres = null;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("banking");
        dbo.collection("banks").insertOne(redt, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close().then(r => {
            });
        });
    });
    res.send(true);
});


// Serve Static Files
app.use(express.static(__dirname + '/public'));

// Listen to Port
app.listen(port, () => {
    console.log('Node Server running at : ', port);
    console.log(('http://localhost:' + port));
});