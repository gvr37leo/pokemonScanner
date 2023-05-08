const fs = require("fs");
var https = require('https');
var httpserver = require('http');
var express = require('express')

var key = '754881218d14438a917863e5869e85d5bca3934ee0aca08e77e21f36865a767a'
var engine = 'google_lens'
var imageurl = 'https://assets.pokemon.com/assets/cms2/img/cards/web/PGO/PGO_EN_30.png'
var hl = 'en'
// var siteurl = 'https://6667-77-170-184-210.ngrok.io/'

// https://docs.ximilar.com/services/collectibles_recognition/#card-identification-v2card_id
var ximilartoken = '72012d2db39aea45075cc378ac992df7eecfea20'





var app = express()
app.use(express.json({limit:'200mb'}))
app.use(express.static('./'))

app.post('/lens',(req,res) => {
    
    //imageurl is null
    // const buffer = Buffer.from(req.body.imageurl.slice('data:image/png;base64,'.length), "base64");
    // fs.writeFileSync("./images/image.png", buffer);


    fetch('https://api.ximilar.com/collectibles/v2/card_id',{
        method:'POST',
        headers:{
            Authorization:`Token ${ximilartoken}`
        },
        body:JSON.stringify({
        "records": [
            //   { "_url": "https://teamcovenant.com/wp-content/uploads/2019/06/pikachu.jpg"}
              ,{"_base64":req.body.imageurl.slice('data:image/png;base64,'.length)}
        ], "lang": true
      })
    }).then(res => res.json())
    .then(data => {
        res.send(data)
    })

    // fetch(`https://serpapi.com/search.json?engine=${engine}&url=${`${req.body.origin}/images/image.png`}&hl=${hl}&api_key=${key}&no_cache=true`, {})
    // .then(res => res.json())
    // .then(data => {
    //     res.send(data)
    // })
})


app.listen(80)
// var http = express();
// http.get('*', function(req, res) {  
//     res.redirect('https://' + req.headers.host + req.url);
// })
// http.listen(80);
// var options = {
//     key: fs.readFileSync('/etc/letsencrypt/live/poke-dex.com/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/poke-dex.com/fullchain.pem')
// };
// https.createServer(options, app).listen(443);
console.log('listening')

// fetch('https://api.ximilar.com/dom_colors/generic/v2/dominantcolor',{
//     headers:{
//         "Content-Type":"application/json",
//         "Authorization":"72012d2db39aea45075cc378ac992df7eecfea20"
//     },
//     body:JSON.stringify({
//         "records":[
//             {"url":"https://images.ximilar.com/examples/cards/jordan.jpeg"}
//         ]
//     })
// })
