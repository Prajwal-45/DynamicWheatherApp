const http = require("http");
const fs = require("fs");
var requests = require("requests");
const { json } = require("node:stream/consumers");

const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal=(tempVal,orgVal)=>{
    let temperatute=tempVal.replace("{%tempval%}",parseInt(orgVal.main.temp-273));
     temperatute=temperatute.replace("{%tempmin%}",parseInt(orgVal.main.temp_min-273));
     temperatute=temperatute.replace("{%tempmax%}",parseInt(orgVal.main.temp_max-273));
     temperatute=temperatute.replace("{%location%}",orgVal.name);
     temperatute=temperatute.replace("{%country%}",orgVal.sys.country);
     temperatute=temperatute.replace("{%tempstatus%}",orgVal.weather[0].main);
   
    return temperatute;
    };

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=411fda49daa41f7bd900338316b4fb6e")
      .on('data',(chunk)=>{
        const objData=JSON.parse(chunk);
        const arrData=[objData];
        console.log(arrData[0].main.temp);
        const realTimeData=arrData
        .map((val)=> replaceVal(homeFile,val))
        .join("");
        res.write(realTimeData);
        res.end()
          
    })      
    
    .on('end',(err)=>{
        if(err)return console.log("connection close due to error",err);
       res.end();
    });
    
  }  
});

server.listen(8000,'127.0.0.1',()=>{
    console.log("hogayaaa");
});
