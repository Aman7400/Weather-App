// jshint esversion:6

//Requring Modules needed
const express = require("express");
const bodyParser = require("body-parser");
const https=require("https");


const app = express();

 //Setting view engine to EJS template
app.set("view engine","ejs"); 

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


//Handling Landing Page Request
app.get("/",function(req,res){

  res.sendFile(__dirname+"/index.html");
});


//Handling search  city requests
app.post("/Search",function(req,res){

   
    //Getting Searched city from request
    const city=req.body.city;
    const apiKey="9eb8843a9f8e08b953160dfb24536258";
    const unit="metric";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units="+unit;

    //Checking Status code of request made to Open Weather Map API 
    https.get(url,function(response){
        console.log(response.statusCode);

        if(response.statusCode == 404){
         
         res.render("notFound",{statusCode:response.statusCode});
         
       }

       else {

   
        response.on("data",function(data){

          // Converting JSON string to JS object
            var weatherData= JSON.parse(data);

            console.log(weatherData);
            var long = weatherData.coord.lon;
            var lat = weatherData.coord.lat;
            let countryName = weatherData.sys.country;
            let cityName = weatherData.name;

            
           const timeAPI = "F94TYIKJT86L";
           const timeURL = "https://api.timezonedb.com/v2.1/get-time-zone?key="+timeAPI+"&format=json&by=position&lat="+lat+"&lng="+long;

           //get request to TimeZoneDb API 

           https.get(timeURL,function(resp){

             console.log(res.statusCode);

             resp.on("data",function(data){
               var timeData = JSON.parse(data);
              
               var Format = timeData.formatted;
               
               //Breaking Date and Time data separately
               var timeFormat = Format.split(" ");
               
               //Storing city time
               let cityTime = timeFormat[1];
               cityTime = cityTime.slice(0,5);

               //Creating Date object
               const dateFormat =  new Date(timeFormat[0]);
               let cityDate = dateFormat.toDateString();
               let len = cityDate.length;
               let cityDay = cityDate.slice(0,3);
               let cityMonth = cityDate.slice(4,(len-4));
               const  newDate = cityDay+", "+cityMonth;

               //Stroing various data required  
               var temp= weatherData.main.temp;
               var description = weatherData.weather[0].description;
               var mains = weatherData.weather[0].main;
               var windSpeed =  weatherData.wind.speed;
               var humidity = weatherData.main.humidity;
               var pressure = weatherData.main.pressure;
               var feelsLike = weatherData.main.feels_like;
   
               var icon = weatherData.weather[0].icon;
               var imgURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
              
              
                //Checking weather Status and then rendring page accordingly  
                 if(mains ==="Haze")
                 {
                 res.render("search",{cityName:cityName,countryName :countryName,button:"btn btn-md btn-success",weatherDescription:mains,css:"css/windy.css ",imgsrc:"/images/windy.jpg",src:imgURL,temp:temp,date:newDate,time:cityTime,windSpeed:windSpeed,humidity:humidity,pressure:pressure,feelsLike:feelsLike});
                
                 }
                 else if(mains ==="Clear"){
                   res.render("search",{cityName:cityName,countryName :countryName,button:"btn btn-md btn-primary",weatherDescription:mains,css:"css/sunny.css ",imgsrc:"/images/sunny.jpg",src:imgURL,temp:temp,date:newDate,time:cityTime,windSpeed:windSpeed,humidity:humidity,pressure:pressure,feelsLike:feelsLike});
                 }
                 else if(mains ==="Clouds"){
                   res.render("search",{cityName:cityName,countryName :countryName,button:"btn btn-md btn-primary",weatherDescription:mains,css:"css/cloudy.css ",imgsrc:"/images/cloud.jpg",src:imgURL,temp:temp,date:newDate,time:cityTime,windSpeed:windSpeed,humidity:humidity,pressure:pressure,feelsLike:feelsLike});
                 }
                 else if(mains ==="Rain"){
                   res.render("search",{cityName:cityName,countryName :countryName,button:"btn btn-md btn-danger",weatherDescription:mains,css:"css/rainy.css ",imgsrc:"/images/rain.jpg",src:imgURL,temp:temp,date:newDate,time:cityTime,windSpeed:windSpeed,humidity:humidity,pressure:pressure,feelsLike:feelsLike});
                 }
                 else if(mains ==="Snow"){
                   res.render("search",{cityName:cityName,countryName :countryName,button:"btn btn-md btn-outline-dark",weatherDescription:mains,css:"css/snowy.css ",imgsrc:"/images/snow.jpg",src:imgURL,temp:temp,date:newDate,time:cityTime,windSpeed:windSpeed,humidity:humidity,pressure:pressure,feelsLike:feelsLike});
                 }
                 
                 else{
                   res.render("search",{cityName:cityName,countryName :countryName,button:"btn btn-md btn-info",weatherDescription:mains,css:"css/other.css ",src:imgURL,imgsrc:"/images/others.jpg",temp:temp,date:newDate,time:cityTime,windSpeed:windSpeed,humidity:humidity,pressure:pressure,feelsLike:feelsLike});
                 }
   


               

               
             });
           });

          
          
           
               
            


            }
        );
          }
            
          
          
             

          
        }

        );

      });
      

            
   
             
  
 //go to home request
app.get("/goto",function(req ,res){
  res.redirect("/");
});

//city not found request
app.get("/notfound",function(req,res){
res.redirect("/");
});

//requesting signup page
app.get("/signup",function(req,res){
  res.render("signup");
});

//after signup redirecting to home
app.post("/",function(req,res){
  res.redirect("/");
});


//listening at local port
app.listen(3000,function (){
  console.log("App Started at Port 3000");
  
});
