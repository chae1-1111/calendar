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
            if (result.length != 0) {
                resultJson.code = 200;
                resultJson.message = "login Success";
                resultJson.userkey = result[0].UserKey;
            } else {
                resultJson.code = 201;
                resultJson.message = "no matching Users";
            }
        }
        res.json(resultJson);
    });
});

memberRouter.route("/").post((req, res) => {
    if (!auth(req.body.apikey)) {
        res.json({ code: 401, message: "Invalid API key" });
        return;
    }
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
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
