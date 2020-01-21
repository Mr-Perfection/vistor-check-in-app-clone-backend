"use strict";

const functions = require("firebase-functions");

const cors = require("cors");
const app = require("express")();
const bodyParser = require("body-parser");

// TODO(Stephen): Only allow CORS for whitelist sites.
app.use(cors());

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();

async function createEntry(req, res) {
  // Check for POST request
  if (req.method !== "POST") {
    res.status(400).send("Please send a POST request");
    return;
  }
  const data = JSON.parse(req.body);
  const snapshot = await admin
    .database()
    .ref("/entries")
    .push(data);

  res.send(snapshot.toString());
}

async function getEntries(req, res) {
  // Check for POST request
  if (req.method !== "GET") {
    res.status(400).send("Please send a GET request");
    return;
  }
  if (req.query.filters) {
    const name = req.query.filters.name;
    await ref
      .orderByChild("fullName")
      .equalTo(name)
      .on("value", snapshot => {
        console.log(snapshot.val());
        res.send(snapshot.val());
      });
  } else {
    await admin
      .database()
      .ref("/entries")
      .on(
        "value",
        snapshot => {
          console.log(snapshot.val());
          res.send(snapshot.val());
        },
        errorObject => {
          console.log("The read failed: " + errorObject.code);
          res.status(500).send("Someting went wrong.");
        }
      );
  }
}

async function updateEntry(req, res) {
  if (req.method !== "PATCH") {
    res.status(400).send("Please send a PATCH request");
    return;
  }
  const id = req.params.id;
  console.log("test", req.body, id);
  const data = JSON.parse(req.body);
  const snapshot = await admin
    .database()
    .ref("/entries")
    .child(id)
    .update(data);

  res.status(200).send("Success");
}

app.post("/", createEntry);
// GET method route
app.get("/", getEntries);
app.patch("/:id", updateEntry);

// Take the entry json data passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /entries/:id/{data}
exports.entries = functions.https.onRequest(app);
