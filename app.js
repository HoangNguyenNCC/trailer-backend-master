const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { errorLogger, reqLogger } = require("./app/winston");
const setupApiRoutes = require("./app/routes");
const globalErrorHandler = require("./app/helpers/globalErrorHandler");
const server = http.createServer(app);
dotenv.config();
const config = process.env;
const io = (exports.io = socketio(server));
console.log("ENV : ", config.DB_HOST, config.PORT);

//db options
const db_options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

//db connection
mongoose.connect(config.DB_HOST, db_options);
const db = mongoose.connection;
db.on("connected", function () {
  console.log("mongodb connected");
});
db.on("error", console.error.bind(console, "mongodb connection error:"));
mongoose.set("debug", false);

app.use(cors());

app.use(morgan("combined"));
if (process.env.NODE_ENV === "production") app.use(reqLogger);

app.use(bodyParser.urlencoded({ limit: "12mb", extended: true }));
app.use(bodyParser.text());
app.use(
  bodyParser.json({
    type: "application/json",
    limit: "12mb",
    verify: function (req, res, buf) {
      req.rawBody = buf.toString();
    },
  })
);

app.use(cookieParser());
app.use("/docs", express.static("docs"));
app.use("/adminpanel", express.static("adminpanel"));

// Define Routes
app.get("/", function (req, res) {
  res.json({ message: "Welcome to Trailer2You" });
});

setupApiRoutes(app);

app.use(globalErrorHandler);

io.on("connection", function (socket) {
  console.log("A new Socket Connected " + socket.id);
  socket.on("licenseeJoin", async (data) => {
    console.log("Data from LicenseeJoin Socket " + data);
    let invoiceNumber = data.invoiceNumber;
    console.log({ invoiceNumber, data });
    socket.join(invoiceNumber);
  });
  socket.on("userJoin", async (data) => {
    console.log("Data from userJoin Socket " + data);
    let invoiceNumber = data.invoiceNumber;
    console.log({ invoiceNumber, data });
    socket.join(invoiceNumber);
  });
  socket.on("licenseeLocation", async (data) => {
    console.log("Licensee Location socket data " + data);
    let invoiceNumber = data.invoiceNumber;
    console.log({ invoiceNumber, data });
    socket.to(invoiceNumber).emit("trackingData", data);
    console.log(data);
  });
});

app.use(errorLogger);

server.listen(config.PORT, () => {
  console.log("App is listening on port " + config.PORT);
});
module.exports = app;
