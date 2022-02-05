const memberRouter = require("express").Router();
const auth = require("../auth/auth");

const memberCont = require("../controller/memberCont");

memberCont.connectDB();

memberRouter.route("/").get((req, res) => {
    //login
    if (!auth(req.query.apikey)) {
        res.json({ code: 401, message: "Invalid API key" });
        return;
    }
    const userid = req.query.userid;
    const userpw = req.query.userpw;
    const resultJson = {};
    memberCont.login(userid, userpw, (err, result) => {
        if (err) {
            resultJson.code = 400;
            resultJson.message = "login Failed";
        } else {
            if (result === 1) {
                resultJson.code = 200;
                resultJson.message = "login Success";
            } else {
                resultJson.code = 201;
                resultJson.message = "no matching Users";
            }
        }
        res.json(resultJson);
    });
});

memberRouter.route("/").post((req, res) => {
    if (!auth(req.query.apikey)) {
        res.json({ code: 401, message: "Invalid API key" });
        return;
    }
    const userid = req.body.StartDateTime;
    const userpw = req.body.EndDateTime;
    const name = req.body.UserKey;
    const resultJson = {};
    memberCont.join(userid, userpw, name, (err, result) => {
        if (err) {
            resultJson.code = 400;
            resultJson.message = "Sign Up failed.";
        } else {
            resultJson.code = 200;
            resultJson.message = "Signed Up Successful";
            resultJson.UserKey = result.UserKey;
        }
        res.json(resultJson);
    });
});

module.exports = memberRouter;
