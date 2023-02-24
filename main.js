//
// Original example By Ni SP GmbH // www.ni-sp.com // Use at own risk
// Modifications applied to disable WebGL(2) 

// http://www.ni-sp.com/DCVSDK/
delete window.WebGL2RenderingContext;
delete window.WebGLRenderingContext;

let realGetContext = HTMLCanvasElement.prototype.getContext;

HTMLCanvasElement.prototype.getContext = function (id, n) {
  if (
    id === "experimental-webgl" ||
    id === "moz-webgl" ||
    id === "webgl2" ||
    id === "webgl"
  ) {
    return undefined;
  }
  return realGetContext.call(this, id, n);
}; 
import "./dcvjs/dcv.js"

let auth,
    connection;

console.log("Using NICE DCV Web Client SDK version " + dcv.version.versionStr);
// document.addEventListener('DOMContentLoaded', main);

(function main () {
    console.log("Setting log level to INFO");
    dcv.setLogLevel(dcv.LogLevel.INFO);

    const url = new URL(window.location.href); 
    const serverUrl = url.searchParams.get('server'); 
        
    console.log("Starting authentication with", serverUrl);
    
    auth = dcv.authenticate(
        serverUrl,
        {
            promptCredentials: onPromptCredentials,
            error: onError,
            success: onSuccess
        }
    );
})();


function O1_onPromptCredentials(auth, challenge) {
    // Let's check if in challege we have a username and password request
    if (challengeHasField(challenge, "username") && challengeHasField(challenge, "password")) {
        auth.sendCredentials({username: "my_dcv_user", password: "my_password"})
    } else {
        // Challenge is requesting something else...
    }
}

function challengeHasField(challenge, field) {
    return challenge.requiredCredentials.some(credential => credential.name === field);
}

function onError(auth, error) {
    console.log("Error during the authentication: ", error.message);
}

// We connect to the first session returned
function onSuccess(auth, result) {
    let {sessionId, authToken} = {...result[0]};

    connect(sessionId, authToken);
}

function connect (sessionId, authToken) {
    console.log("Starting DCV connection ...", sessionId, authToken);

    dcv.connect({
        url: serverUrl,
        sessionId: sessionId,
        authToken: authToken,
        divId: "dcv-display",
        callbacks: {
            firstFrame: () => console.log("First frame received")
        }
    }).then(function (conn) {
        console.log("Connection established!");
        connection= conn;
    }).catch(function (error) {
        console.log("Connection failed with error " + error.message);
    });
}

function submitCredentials (e) {
    var credentials = {};
    fieldSet.childNodes.forEach(input => credentials[input.id] = input.value);
    auth.sendCredentials(credentials);
    e.preventDefault();
}

var fieldSet;

function createLoginForm () {
    var submitButton = document.createElement("button");

    submitButton.type = "submit";
    submitButton.textContent = "Login";
    submitButton.id = "butt1";

    var form = document.createElement("form");
    fieldSet = document.createElement("fieldset");
    fieldSet.id ="fs2";
    fieldSet.style.width = "300";
    fieldSet.style.boxShadow = "grey 5px 5px 9px;";
    fieldSet.style.borderRadius = "6px;";
    // fieldSet.style.cssText = 'width: 300px; box-shadow: grey 5px 5px 9px;';
    
    form.onsubmit = submitCredentials;
    form.appendChild(fieldSet);
    fieldSet.style.cssText = 'width: 300px; box-shadow: grey 5px 5px 9px;';
    form.appendChild(submitButton);
    submitButton.style.cssText = 'width: 90px; margin: 6px; box-shadow: grey 1px 1px 6px; font-size: 150%; margin-top: 21px;';

    document.body.appendChild(form);
}

function addInput (name) {
    var type = name === "password" ? "password" : "text";

    var inputField = document.createElement("input");         
    inputField.name = name;
    inputField.id = name;
    inputField.placeholder = name;
    inputField.type = type;
    inputField.style.width = "60";
    inputField.style.boxShadow = "grey 5px 5px 9px;";
    inputField.style.borderRadius = "6px;";
    fieldSet.appendChild(inputField);
    inputField.style.cssText = 'width: 90px; margin: 6px; box-shadow: grey 1px 1px 6px; font-size: 120%; padding: 3px;';
} 

function onPromptCredentials (_, credentialsChallenge) {
    createLoginForm();
    credentialsChallenge.requiredCredentials.forEach(challenge => addInput(challenge.name));
}
