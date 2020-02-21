var jsrp = require('jsrp');
const axios = require('axios').default;

var client = new jsrp.client();
var server = new jsrp.server();

login();

client.init({username: 'matus', password: 'password123', length: 1024}, function () {
    client.createVerifier(function (err, result) {
        // result will contain the necessary values the server needs to
        // authenticate this user in the future.
        register(result.salt, result.verifier);
    });

    client.setSalt(localStorage.getItem('salt'));
    client.setServerPublicKey(localStorage.getItem('b'));

    let a = client.getPublicKey();
    let k = client.getSharedKey();

    verify(a, k)
});

function login() {
    axios.post('http://192.168.88.232:8081/login', {
        "username": "matus",
    }).then((response) => {
        localStorage.setItem('b', response.data.b);
        localStorage.setItem('salt', response.data.salt);
    })
}

function register(salt, verifier) {
    axios.post('http://192.168.88.232:8081/reg', {
        "nick": "matus",
        "salt": salt,
        "verifier": verifier
    }).then((response) => {
        localStorage.setItem('verifier', response.data.salt);
    });
}

function verify(a, k) {
    axios.post('http://192.168.88.232:8081/auth', {
        "nick": "matus",
        "a": a,
        "k": k
    }).then((response) => {
        console.log(response);
    })
}
