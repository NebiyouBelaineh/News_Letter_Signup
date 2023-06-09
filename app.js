require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();


const localPort = process.env.LOCALHOST_PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public/"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data); //To convert JSON to string object


  const url = "https://" + process.env.DATA_CENTER + ".api.mailchimp.com/3.0/lists/" + process.env.AUDIENCE_LIST;
  const options = {
    method: "POST",
    auth: "NebiyouBelaineh:" + process.env.API_ID,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/faliure.html");
    }

    response.on("data", function (data) {
      const parsedJSON = JSON.parse(data); //Parsed JSON data from HTTPS

      console.log(parsedJSON);
      //Section to send response to the user on sign up attempt.
    });
  });
  request.write(jsonData);
  request.end(); //Specify end of request
});

app.post("/faliure", function (req, res) {
  res.redirect("/");
});

//Port may need changing
app.listen((localPort || process.env.PORT), function () {
  console.log("Server started on port " + localPort);
});
