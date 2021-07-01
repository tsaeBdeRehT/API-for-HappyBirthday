const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");

const app = express();


const port = process.env.PORT;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);


app.use(function (req, res, next){
    res.setHeader("Access-Control-Allow-Credentials", 'true');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    next();
})


app.listen(port);

const filePath = "comments.json";

app.get("/api/comments", function(req, res){
    const content = fs.readFileSync(filePath,"utf8");
    const users = JSON.parse(content);
    res.send(users);
});

app.post("/api/comments", function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const userName = req.body.name;
    const userText = req.body.text;
    const userId = req.body.id;
    let comment = {id: userId, name: userName, text: userText};

    let data = fs.readFileSync(filePath, "utf8");
    let comments = JSON.parse(data);

    comments.push(comment);
    data = JSON.stringify(comments);
    fs.writeFileSync("comments.json", data);
    res.send(comment);
});

app.get('/:folder/:file', (req, res) => {
    res.sendFile(__dirname + `/dist/` + req.params.folder + '/'+ req.params.file);
});
app.get('/:file', (req, res) => {
    res.sendFile(__dirname + `/dist/` + req.params.file);
});
app.get('/*', (req, res) => {
    res.sendFile(__dirname + `/dist/index.html`);
});

