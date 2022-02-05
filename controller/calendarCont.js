const mongoose = require("mongoose");
const mongoConf = require("../config/mongoDB.json");

const calendarCont = {};

let database;
let CalSchema;
let CalModel;

const arLastDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

calendarCont.connectDB = () => {
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
        CalSchema = mongoose.Schema(
            {
                StartDateTime: Date,
                EndDateTime: Date,
                UserKey: Number,
                Title: String,
                Memo: String,
                AllDay: Boolean,
            },
            { versionKey: false }
        );

        CalModel = mongoose.model("calendar", CalSchema);
    });
};

calendarCont.insert = (
    StartDateTime,
    EndDateTime,
    UserKey,
    Title,
    Memo,
    AllDay,
    callback
) => {
    const schedule = new CalModel({
        StartDateTime: new Date(StartDateTime).getTime() + 3600000 * 9,
        EndDateTime: new Date(EndDateTime).getTime() + 3600000 * 9,
        UserKey: UserKey,
        Title: Title,
        Memo: Memo,
        AllDay: AllDay,
    });
    schedule.save((err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        } else {
            callback(null, result);
            console.log(result);
        }
    });
};

calendarCont.getList = (q, callback) => {
    CalModel.find(
        {
            StartDateTime: {
                $gte:
                    new Date(
                        `${q.year}-${q.month}-${q.date ? q.date : "01"}T00:00`
                    ).getTime() +
                    3600000 * 9,
                $lte:
                    new Date(
                        `${q.year}-${q.month}-${
                            q.date ? q.date : arLastDay[q.month - 1]
                        }T23:59`
                    ).getTime() +
                    3600000 * 9,
            },
        },
        (err, result) => {
            if (err) {
                console.log(err);
                callback(err, null);
                return;
            } else {
                callback(null, result);
            }
        }
    );
};

calendarCont.remove = (id, UserKey, callback) => {
    CalModel.remove({ _id: id, UserKey: UserKey }, (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        } else {
            callback(null, result);
        }
    });
};

calendarCont.update = (id, UserKey, schedule, callback) => {
    CalModel.update(
        { _id: id, UserKey: UserKey },
        { $set: schedule },
        { multi: false },
        (err, result) => {
            if (err) {
                console.log(err);
                callback(err, null);
                return;
            } else {
                console.log(result);
                callback(null, result);
            }
        }
    );
};

module.exports = calendarCont;
