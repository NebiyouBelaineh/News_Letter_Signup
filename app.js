const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

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

  const dc = "us21";
  const url = "https://" + dc + ".api.mailchimp.com/3.0/lists/7b448776fa";
  const options = {
    method: "POST",
    auth: "NebiyouBelaineh:2ca6a902e413a8c87c0dd500d54c9d0e-us221",//Not correct, fix later
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/faliure.html");
      }
      
    response.on("data", function (data) {

      const parsedJSON = JSON.parse(data); //Parsed JSON data from HTTPS

      // console.log(parsedJSON);

      //Section to send response to the user on sign up attempt.
    });
  });
  request.write(jsonData);
  request.end(); //Specify end of request

  //   console.log("Request Status Code:  " + );
  //   if(res.statusCode === 200){
  //     res.sendFile(__dirname + "/success.html");
  //   }
  //   else{
  //     res.sendFile(__dirname + "/faliure.html");
  //   }
});

app.post("/faliure", function(req,res){
  res.redirect('/');
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

// Mailchimp API KEY

// 2ca6a902e413a8c87c0dd500d54c9d0e-us21

//Audinece ID

// 7b448776fa
