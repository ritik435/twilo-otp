const express = require('express');
const twilio = require('twilio');

const app = express();
const port = 5000;

const accountSid = "AC0a193273b45d2ba265b0b06e602bd3b3";
const authToken = "7af94407c5c3b0bb4b06d5852f800d33";
const serviceId = "MGbc680112d878628eb775534a068d8509"
const client = require('twilio')(accountSid, authToken);


app.use(express.static("public"));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})
app.post('/send-verification', (req, res) => {
    const { phone } = req.body;

    client.verify.v2
        .services(serviceId)
        .verifications
        .create({ to: `+91${phone}`, channel: 'sms' })
        .then(verification => {
            return res.status(200).json({ verification })
        }).catch(err => {
            console.log("err in sending", err);
            return res.status(400).json({ err });
        })

})

app.post('/verify', (req, res) => {
    const { phone, otp } = req.body;

    client.verify.v2
        .services(serviceId)
        .verificationChecks
        .create({ to: '+91' + phone, code: otp })
        .then(verification_check => {
            return res.status(200).json({ verification_check })
        }).catch(err => {
            return res.status(400).json({ err });
        })
})




app.listen(port, () => {
    console.log(`App is listening to port`);
})