const express = require("express");

const app = express();

app.use("/test",(req, res) => {
  res.send("test from backend");
});
app.use("/hello",(req, res) => {
  res.send("hello from backend");
});

app.listen(3000, () => {
  console.log("server is running on 3000");
});
