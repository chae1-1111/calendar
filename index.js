const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

const testRouter = require("./router/testRouter");
app.use("/test", testRouter);

const calendarRouter = require("./router/calendarRouter");
app.use("/calendar", calendarRouter);

const memberRouter = require("./router/memberRouter");
app.use("/member", memberRouter);

app.use(cors());

app.disable("x-powered-by");

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행 중...`);
});
