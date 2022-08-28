const loginForm = document.getElementById("login-form");
const baseUrl = "http://localhost:5000/";
var phone;
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    phone = parseInt(document.getElementById("phone").value)
    if (isNaN(phone)) {
        alert('Invalid Mobile Number');
    } else {
        //something
        sendVerification(phone);
    }

})

async function sendVerification(phone) {
    const res = await axios.post(baseUrl + 'send-verification', {
        phone,
    });
    console.log(res);
}

