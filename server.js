var express = require("express");
const res = require("express/lib/response");
var app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);


var mangUsers = [];
var mangpassword = [];
var Usersonline = [50];
io.on("connection", function(socket) {
    console.log("Dia chi id" + socket.id + "  dang nhap thanh cong");


    socket.on("registernow", function(data) {
        if ((mangUsers.indexOf(data.ten) >= 0) || (data.matkhau == "") || (data.matkhau != data.rematkhau)) {

            socket.emit("server-send-tkhoan-da-dangki");
        } else {
            mangUsers.push(data.ten);
            Usersonline.push(data.ten);
            mangpassword.push(data.matkhau);
            socket.Username = data.ten;
            socket.emit("server-send-dki-thanhcong", data.ten);
            io.sockets.emit("server-send-danhsach-Users", Usersonline);
        }
    });

    socket.on("client-send-Username", function(data) {
        // console.log(data);
        if (mangUsers.indexOf(data.ten) >= 0) {
            if (Usersonline.indexOf(data.ten) >= 0) {
                socket.emit("co-nguoi-dang-nhap");
            } else {
                Usersonline.push(data.ten);
                socket.Username1 = data.ten;
                socket.emit("server-send-dnhap-thanhcong", data.ten);
                io.sockets.emit("server-send-danhsach-Users", Usersonline);

            }

        } else {
            socket.emit("taikhoanchuadangki");
        }
    });

    socket.on("logout", function() {
        Usersonline.splice(
            Usersonline.indexOf(socket.Username), 1
        );

        socket.broadcast.emit("server-send-danhsach-Users", Usersonline);
    });

    socket.on("user-send-message", function(data) {
        io.sockets.emit("server-send-mesage", { un: socket.Username, nd: data });
    });

    socket.on("disconnect", function() {
        // io.sockets.emit("thongbao");
        Usersonline.splice(
            Usersonline.indexOf(socket.Username), 1
        );

        socket.broadcast.emit("server-send-danhsach-Users", Usersonline);
    });



});

app.get("/", function(req, res) {
    res.render("trangchu");
});