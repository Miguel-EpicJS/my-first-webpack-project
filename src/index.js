const express = require("express");
const app = express();
const fs = require('fs');
const cors = require('cors');

let data = JSON.parse(fs.readFileSync('user.json'));

app.use(cors());
app.use(express.json());

app.get("/score", (req, res) => {
    data = JSON.parse(fs.readFileSync('user.json'));
    res.json(data);
});
app.post("/score", (req, res) => {
    const score = {score: req.body.score};
    const writeData = JSON.stringify(score);
    fs.writeFileSync('user.json', writeData);
    data = JSON.parse(fs.readFileSync('user.json'));
    res.send("ok");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});