let http = require("http");
let fs = require("fs");

let server = http.createServer((req, res)=>{
    if(req.url === "/"){
        res.redirect("/index.html");
    }
    let ps = __dirname + "/public"+ req.url;
    fs.createReadStream(ps).pipe(res);
    let url = req.url;
    if(url.substr(url.length-3, 3) === ".gz"){
        res.writeHead(200, {
            'Content-Encoding' : "gzip",
            'content-type' : "application/octet-stream"
        })
    } 
}).listen(3000);