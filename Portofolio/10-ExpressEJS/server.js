const express = require("express");
const path = require("path");
const app = express();
const https = require("https");

// Configure the express server

//Static content
app.use(express.static(path.join(__dirname, "public")));

//handle input/output json
app.use(express.json());

//handle forms
app.use(express.urlencoded({ extended: true}));

//ejs templates
app. set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const longContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

let posts = [];
let userName = "";

//Root path return the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

//Submit the name by get (unsecured)
app.get("/login", (req, res) => {
  userName = req.query.name;
  //res.send(`Hi ${userName}! You have logged in using get method (unsecured)`); step 2
  //res.render("test", {name: userName, method: "get"}); step 3
  res.redirect("/home");
});

//Submit the name by post (secured)
app.post("/login", (req, res)=> {
  userName = req.body.name;
  //res.send(`Hi ${userName}! You have logged in using post method (secured)`); step 2
  //res.render("test", {name: userName, method: "post"}); step 3
  res.redirect("/home");
});

//I use this for the step 2: basic interaction
/*app.get("/test", (req, res)=> {
  if (!userName) {
    return res.redirect("/");
  }
  res.render("test", { name: userName });
})*/

//Blog posts
//List of posts - get to home
app.get("/home", (req, res) => {
  if(!userName) {
    return res.redirect("/");
  }
  res.render("home", {name: userName, posts });
});

//Rute to add a new post
app.post("/add-post", (req, res)=> {
  const { title, content } = req.body;
  posts.push({title, content});
  res.redirect("/home")
});

//Rute to see an individual post
app.get("/post/:id", (req, res)=> {
  const index = req.params.id;
  const post = posts[index];
  if (!post) {
    return res.redirect("/home");
  }
  res.render("post", {post, index });
});

//Rute for edit a post
app.post("/edit-post/:id", (req, res)=> {
  const index = req.params.id;
  posts[index].content = req.body.content;
  res.redirect("/home");
});

//Rute for delete post
app.post("/delete-post/:id", (req, res)=> {
  const index = req.params.id;
  posts.splice(index, 1);
  res.redirect("/home");
});

app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});