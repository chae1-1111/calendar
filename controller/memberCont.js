const mongoose = require("mongoose");
const mongoConf = require("../config/mongoDB.json");

const autoIncrement = require("mongoose-auto-increment");

const memberCont = {};

let database;
let MemberSchema;
let MemberModel;

memberCont.connectDB = () => {
    mongoose.Promise = global.Promise;

    mongoose.connect(mongoConf.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    database = mongoose.connection;
    database.on("error", () =>
        console.error.bind(console, "Connect Error in MongoDB!")
    );
    database.on("open", () => {
        console.log("Connect Database!");
        autoIncrement.initialize(mongoose);
        MemberSchema = mongoose.Schema(
            {
                UserKey: Number,
                Userid: String,
                Userpw: String,
                Name: String,
            },
            { versionKey: false }
        );

        MemberSchema.plugin(autoIncrement.plugin, {
            model: "MemberModel",
            field: "UserKey",
            startAt: 100000,
            increment: 1,
        });

        MemberModel = mongoose.model("member", MemberSchema);
    });
};

memberCont.login = (userid, userpw, callback) => {
    MemberModel.find({ Userid: userid, Userpw: userpw }, (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        } else {
            callback(null, result);
        }
    });
};

memberCont.join = (userid, userpw, name, callback) => {
    const member = new MemberModel({
        Userid: userid,
        Userpw: userpw,
        Name: name,
    });
    member.save((err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

module.exports = memberCont;
