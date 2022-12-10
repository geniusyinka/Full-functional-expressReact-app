
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
const path = require('node:path');
const bcrypt = require("bcryptjs"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      multer = require("multer"),
      jwt = require("jsonwebtoken");
//import ssx libraries below



const app: Express = express();
const port = process.env.PORT || 5000;

//paste ssx instantiation below:


//login

// (A2) EXPRESS + MIDDLEWARE
app.use(multer().array());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// (B) USER ACCOUNTS - AT LEAST ENCRYPT YOUR PASSWORDS!
// bcrypt.hash("111111", 8, (err, hash) => { console.log(hash); });
const users = {
  "jon@doe.com" : "$2a$08$HwENa0B1VJxPGYhzDhNsQeFjYQCf8Pwu6hGG6HJ/yyAhLKOA28AFG"
};


// (C) JSON WEB TOKEN
// (C1) SETTINGS - CHANGE TO YOUR OWN!
const jwtKey = "007",
      jwtIss = "yinka",
      jwtAud = "http://localhost:3000",
      jwtAlgo = "HS512";
 
// (C2) GENERATE JWT TOKEN
var  jwtSign = email => {
  // (C2-1) RANDOM TOKEN ID
  let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&_-", rnd = "";
  for (let i=0; i<16; i++) {
    rnd += char.charAt(Math.floor(Math.random() * char.length));
  }
 
  // (C2-2) UNIX NOW
  let now = Math.floor(Date.now() / 1000);
 
  // (C2-3) SIGN TOKEN
  return jwt.sign({
    iat : now, // issued at - time when token is generated
    nbf : now, // not before - when this token is considered valid
    exp : now + 3600, // expiry - 1 hr (3600 secs) from now in this example
    jti : rnd, // random token id
    iss : jwtIss, // issuer
    aud : jwtAud, // audience
    data : { email : email } // whatever else you want to put
  }, jwtKey, { algorithm: jwtAlgo });
};
// console.log(jwt.sign.nbf)

 
// (C3) VERIFY TOKEN
 var jwtVerify = (cookies: any) => {
  if (cookies.JWT===undefined) { return false; }
  try {
    let decoded = jwt.verify(cookies.JWT, jwtKey);
    // DO WHATEVER EXTRA CHECKS YOU WANT WITH DECODED TOKEN
    // console.log(decoded);
    return true;
  } catch (err) { return false; }
}


// (D) EXPRESS HTTP
// (D1) STATIC ASSETS
app.use("/assets", express.static(path.join(__dirname, "assets")))
 
// (D2) HOME PAGE - OPEN TO ALL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/1-home.html"));
});

 
// (D3) ADMIN PAGE - REGISTERED USERS ONLY
app.get("/admin", (req, res) => {
  if (jwtVerify(req.cookies)) {
    res.sendFile(path.join(__dirname, "/2-admin.html"));
  } else {
    res.json({message: 'you need to login'})
  }
});


// (D4) LOGIN PAGE
app.get("/login", (req, res) => {
  if (jwtVerify(req.cookies)) {
    res.redirect("../admin");
  } else {
    res.json({message: 'login page'})
  }
});
 
// (D5) LOGIN ENDPOINT
app.post("/in", async (req, res) => {
  let pass = users[req.body.email] !== undefined;
  if (pass) {
    pass = await bcrypt.compare(req.body.password, users[req.body.email]);
  }
  if (pass) {
    res.cookie("JWT", jwtSign(req.body.email));
    res.status(200);
    res.send("OK");
  } else {
    res.status(201);
    res.send("Invalid user/password");
  }
});


// (D6) LOGOUT ENDPOINT
app.post("/out", (req, res) => {
  res.clearCookie("JWT");
  res.status(200);
  // res.send("OK");
  res.redirect('/')
});

//end

app.use(
  cors({
    origin: 'http://localhost:3000', //or whatever your frontend server is!
    credentials: true,
  })
);

// SSX Begins - paste below


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
