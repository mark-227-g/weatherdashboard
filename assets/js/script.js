/************************************** 
References
**************************************/
var weatherURLKey="cd9964c300819532fb2997b8363c0542";
var searchBtnEl = document.querySelector("#searchCity");

/************************************** 
global variables
**************************************/


/************************************** 
buttons
**************************************/

/************************************** 
classes
**************************************/

class WeatherAPI{
    /*
    city="";
    state="";
    country="";
    limit=1;
    */
    constructor(key)
    {
        this.key=key;
    };
    geoCodeURLbyZip(zipcode)
    {
        return("https://api.openweathermap.org/data/2.5/forecast?zip="+zipcode+"&units=imperial&appid="+this.key);
    };
    geoCodeURL(city,state,country,limit=1)
    {
        return("https://api.openweathermap.org/geo/1.0/direct?q="+city+","+state+","+country+"&limit="+limit+"&units=imperial&appid="+this.key);
    };
    weatherURL(lat,lon)
    {
        return("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=imperial&appid="+this.key);
    };
    weatherForcastURL(lat,lon)
    {
        return("https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&cnt=40&units=imperial&appid="+this.key);
    };   
};
let w = new WeatherAPI(weatherURLKey);
/************************************** 
functions
**************************************/
function convertDT(timestamp)
{
    let date = new Date(timestamp*1000);
    return(date);
};

function getWeatherIcon(id){
    var url="https://openweathermap.org/img/wn/"+id+".png";
    var img="<img src="+url+" ></img>";
    return(img);
}
function wrapLI(text)
{
    return("<li>"+text+"</li>");
}

function ShowCurrentWeather(data)
{
document.getElementById("city").innerHTML=data.name+" ("+convertDT(data.dt).toLocaleDateString()+")"+getWeatherIcon(data.weather[0].icon);
document.getElementById("temp").innerHTML="Temp: "+data.main.temp+" &#8457;";
document.getElementById("wind").innerHTML="Wind: "+data.wind.speed+"&nbspMPH";
document.getElementById("humidity").innerHTML="Humidity: "+data.main.humidity+"%";
};


function fillWeatherCards(data)
{
var weatherHTML="";
var cardCount=1;
for (var i = 0; i < data.cnt; i+=1) {
    if(convertDT(data.list[i].dt).getHours()==11)
    {
        weatherHTML="<ul>" +
            wrapLI(convertDT(data.list[i].dt).toLocaleDateString())+
            wrapLI(getWeatherIcon(data.list[i].weather[0].icon))+
            wrapLI("Temp: "+data.list[i].main.temp+" &#8457;") +
            wrapLI("Wind: "+data.list[i].wind.speed+"&nbspMPH") +
            wrapLI("Humidity: "+data.list[i].main.humidity+"%")+
            "</ul>";
        document.getElementById("forcastCard-"+cardCount).innerHTML=weatherHTML;
        cardCount++;
    };
  }
};


function getWeather()
{
    fetch(w.weatherURL(40.735657,-74.1723667))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ShowCurrentWeather(data);
    });
};

function getForcast()
{
    fetch(w.weatherForcastURL(40.735657,-74.1723667))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            fillWeatherCards(data);
        });
};

function getGeocode(city,state)
{
    fetch(w.geoCodeURL(city,state))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            w.lat=data.lat;
            w.lon=data.lon;
            console.log(w.lat+" : "+ w.log);
        });
}

function searchCity(event)
{
    var searchTxt=document.getElementById("cityInput").value;
    const searchValue= searchTxt.split(",");
    if(searchValue.length==2)
    {
        w.city=searchValue[0].trim();
        w.state=searchValue[1].trim();
        getGeocode(w.city,w.state);
    };


}
/************************************** 
Add event listener to generate button
**************************************/
searchBtnEl.addEventListener("click", searchCity);


