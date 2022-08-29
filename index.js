const express = require('express');
const mongoose = require('mongoose');
const User = require("./model/User.js")
// const alert = require("alert-node");

const app = express();
const PORT = 5000;

// const accountSid = "AC7004b4b93ef7ad7f9fb5cfae399ef789";
// const authToken = "03f0a9468a76f30f227eea870ea771b3";
// const serviceId = "MG0a0852f29c0c57cf7751819d3d652f43";
const accountSid = "AC0a193273b45d2ba265b0b06e602bd3b3";
const authToken = "7af94407c5c3b0bb4b06d5852f800d33";
const serviceId = "VA2a3abf1d1eb62dfdd87861f23aeba4bb"

const client = require('twilio')(accountSid, authToken);


app.use(express.static("public"));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})
app.get("/send-message", (req, res) => {
    client.messages
        .create({
            body: 'Hello from Node',
            to: '+919817326281', // Text this number
            from: '+19786788831', // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
})


app.post('/store-in', (req, res) => {
    User.findOne({ phone: req.body.phone, email: req.body.email }, function (err, user) {
        if (err) {
            console.log("error in finding user in sign up", err); return;
        }
        if (!user) {


            User.create(req.body, (err, user) => {
                if (err) {
                    console.log("error in creating user in sign up", err);
                    return res.status(404).json({ err });
                }
                console.log("User created");
                return res.status(200).json({ user: "created" });

            });
        }
        else {
            console.log("already exist");
            return res.status(200).json({ user: "already-exist" });
        }
    })


})


app.post('/send-verification', (req, res) => {
    const { phone } = req.body;

    client.verify.v2
        .services(serviceId)
        .verifications
        .create({ to: "+91" + phone, channel: 'sms' })
        .then(verification => {
            // console.log(verification.sid);
            return res.status(200).json({ verification })
        }).catch(err => {
            // console.log("err in sending", err);
            return res.status(400).json({ err });
        })

})

app.post('/verify', (req, res) => {
    const { phone, code } = req.body;

    client.verify.v2
        .services(serviceId)
        .verificationChecks
        .create({ to: '+91' + phone, code })
        .then(verification_check => {
            console.log(verification_check);
            return res.status(200).json({ verification_check })
        }).catch(err => {
            return res.status(400).json({ err });
        })
})




const CONNECTION_URL = "mongodb+srv://ritik:sa5AnRXfIF59Dchu@cluster0.5wspxnl.mongodb.net/test";


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`http://localhost:${PORT}/`)))
    .catch((error) => console.log(error.message));

