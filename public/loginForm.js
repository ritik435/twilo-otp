var phone1;

const message = document.getElementById("btn");
const loginForm = document.getElementById("login-form");
const codeInput = document.getElementById("code-input");
const baseUrl = "http://localhost:5000/";
var phone;
var email;
let isOtpDelivered = false;



loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    phone = parseInt(document.getElementById("phone").value)
    if (isNaN(phone)) {
        alert('Invalid Mobile Number');
    } else {
        //something
        if (isOtpDelivered) {
            const code = codeInput.value;
            const verifyRes = await verifyOTP(phone, code);
            setResponse(verifyRes.status);
            return;
        }

        const response = await sendVerification(phone);
        if (response.status === 'pending') {
            codeInput.classList.remove("hidden");
            isOtpDelivered = true;
        }
    }

})

async function sendVerification(phone) {
    const res = await axios.post(baseUrl + 'send-verification', { phone });
    console.log(res);
    if (res.status === 200) {
        return res.data.verification;
    } else {
        return res.data;
    }
}


async function verifyOTP(phone, code) {
    const res = await axios.post(baseUrl + `verify`, { phone, code });
    // console.log(res);
    if (res.status === 200) {
        return res.data.verification_check;
    } else {
        return res.data;
    }
}
async function VerifyMongo(phone, email) {
    phone = parseInt(document.getElementById("phone").value);
    email = document.getElementById("email").value;
    const res = await axios.post(baseUrl + 'store-in', { email, phone });
    return res.data.user;
}

async function setResponse(status) {
    if (status === "approved") {
        const mongoRes = await VerifyMongo(phone, email);
        if (mongoRes === 'created') {
            alert('User created');
        } else if (mongoRes === 'already-exist') {
            alert('User already exist');
        }
    }
    else if (status === "pending") alert('Invalid OTP');
}







message.addEventListener("click", (e) => {
    e.preventDefault();
    phone1 = parseInt(document.getElementById("phone1").value)
    sendMessage(phone);

})
async function sendMessage(phone) {
    const res = await axios.get(baseUrl + 'send-message');
    console.log(res);
}