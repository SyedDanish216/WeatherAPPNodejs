const http=require("http");
const fs=require("fs");
var requests = require('requests');

const homeFile=fs.readFileSync("home.html","utf-8");
const replaceval=(tempVal,orgVal)=>{
  let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);
  temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min);
   temperature=temperature.replace("{%tempmax%}",orgVal.main.temp_max);
   temperature=temperature.replace("{%location%}",orgVal.name);
   temperature=temperature.replace("{%country%}",orgVal.sys.country);
   
  return temperature;
};

const server=http.createServer((req,res)=>{
    if(req.url== "/")
    {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=c119ee953f6e9d18ce123a8b46d47527'
        )
        .on("data",(chunk)=> {
          const objData=JSON.parse(chunk);
          const arrData=[objData];
         // console.log(arrData[0].main.temp)
         const realTimeData=arrData.map((val) => replaceval(homeFile,val)).join("");
         
         //console.log(realTimeData);
         res.write(realTimeData);
        })
        .on("end", (err)=> {
          if (err) return console.log('connection closed due to errors', err);
          res.end();
        });
    }
})
server.listen(8080,"127.0.0.1");
