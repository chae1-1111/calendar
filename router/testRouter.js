const testRouter = require("express").Router();

testRouter.route("/").get((req, res) => {
    res.writeHead(200, { "content-type": "text/html;charset=utf8" });
    res.write(
        "<h2 style='text-align: center; margin-top: 100px'>테스트 페이지 입니다.</h2>"
    );
    res.write("<p style='text-align: center'>찾아와주셔서 감사합니다.</p>");
    res.write("<p style='text-align: center'>Hello</p>");
    res.end();
});

module.exports = testRouter;
