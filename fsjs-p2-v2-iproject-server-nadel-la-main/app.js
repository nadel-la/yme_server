if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// console.log(process.env);
// const app = require("./app");
const port = process.env.PORT || 3000;

const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./routers");

app.use(cors());
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use(router);

// app.get("/helloworld", (req, res) => {
//   res.status(200).json("hello");
// });

app.listen(port, () => {
  console.log(`i love you ${port}`);
});
// module.exports = app;
