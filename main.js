
// https://serpapi.com/google-lens-api
// 754881218d14438a917863e5869e85d5bca3934ee0aca08e77e21f36865a767a
// https://serpapi.com/search.json?engine=google_lens&url=https%3A%2F%2Fi.imgur.com%2FHBrB8p0.png&hl=en&api_key=754881218d14438a917863e5869e85d5bca3934ee0aca08e77e21f36865a767a

//todo

// text search
// pokedex foto aanpassen
// video schermvullend
// ximilar api uitproberen


var ximilartoken = '72012d2db39aea45075cc378ac992df7eecfea20'
var mewtwoimgurl = 'https://static.cardmarket.com/img/4af167c1fc2457cefa9b03bae6100e18/items/51/PGO/665266.jpg'
let canvas = document.querySelector('canvas')
let streaming = false;
let width = 540
let height = 531

class AccountScreen{
    constructor(){
        this.root = document.createElement('div')

        startContext(this.root)



        div()
            text('account screen')
        end()

        endContext()
    }
}

class ScanScreen{
    constructor(){
        this.root = document.createElement('div')
        this.root.style = `
            width:100%;
            height:100%; 
            display:flex;
            flex-direction: column;
            align-items: center;
            position:relative;
        `
        startContext(this.root)
        img({src:'/images/pokedex.png',style:'position:absolute; width:100%; height:100%'})
        // end()
        let videowrapper = cr('div',{style:`
            position: absolute;
            background: black;
            top: 18%;
            left: 8%;
            right: 8%;
            bottom: 22%;
            z-index: -1;
        `})
            this.videoel = crend('video','',{autoplay:true})

        end()
        // img({width:'100%',height:'100%',src:mewtwoimgurl})
        // div({style:'position:absolute; top:0;left:0;right:0;height:50px;'});
            // text('hello');
        // end(); 
        let scrnshotbtn = crend('button','scan',{style:`
            margin: 30px;
            padding: 20px;
            font-weight: bold;
            font-size: 30px;
            position:absolute;
            bottom:0px;
        `}).on('click', e => {
            scrnshotbtn.disabled = true
            scrnshotbtn.innerText = 'loading'
            e.preventDefault()
            scanscreen.takePhoto().then(() => {
                maindiv.innerHTML = ''
                maindiv.appendChild(pkmnscreen.root)
            }).finally(() => {
                scrnshotbtn.disabled = false
                scrnshotbtn.innerText = 'scan'
            })
        })

        endContext()

        this.videoel.addEventListener('canplay',e => {
            if (!streaming) {
                width = videowrapper.clientWidth
                height = videowrapper.clientHeight

                this.videoel.setAttribute("width", width);
                this.videoel.setAttribute("height", height);
                canvas.setAttribute("width", width);
                canvas.setAttribute("height", height);
                streaming = true;
              }
        })

        this.getMedia()
    }

    async getMedia(){
            
            let mediastream = await navigator.mediaDevices.getUserMedia({
                video:{
                    facingMode:"environment" 
                },
                audio:false,
            }).catch(r => {
                console.log(r)
            })
            this.videoel.srcObject = mediastream
            // this.imageCapture = new ImageCapture(mediastream.getVideoTracks()[0])
            
            
            // this.videoel.src = '/mewtwo.mp4'
            // this.videoel.onloadedmetadata = () => {
                // this.videoel.play();
            // };
    
    }

    async takePhoto() {

        let imageurl = null
        const context = canvas.getContext("2d");
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(this.videoel, 0, 0, width, height);
        
            imageurl = canvas.toDataURL("image/png");
            pkmnscreen.img.setAttribute("src", imageurl);
        }


        // fetch('https://api.ximilar.com/collectibles/v2/card_id',{
        //     method:'POST',
        //     headers:{
        //         Authorization:`Token ${ximilartoken}`
        //     },
        //     body:JSON.stringify({
        //     "records": [
        //         //   { "_url": "https://teamcovenant.com/wp-content/uploads/2019/06/pikachu.jpg"}
        //         {"_base64":imageurl.slice('data:image/png;base64,'.length)}
        //     ], "lang": true
        // })
        // }).then(res => res.json())
        // .then(data => {
        //     console.log(data)
        //     var best_match = data.records[0]._objects[0]._identification.best_match
        //     best_match.name
        //     best_match.full_name
        //     best_match.card_number
        //     best_match.sources['pkmncards.com']
        //     best_match.sources['tcgplayer.com']

        //     pkmnscreen.title.innerText = best_match.name
        //     pkmnscreen.link.innerText = 'cardmarket.com'
        //     pkmnscreen.link.href = `https://www.cardmarket.com/en/Pokemon/Products/Search?searchString=${best_match.name}+${best_match.set_code}`
        //     // pkmnscreen.img.src = othersitematch.thumbnail
        // })

        return await fetch('/lens',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                imageurl:imageurl,
                origin:window.location.origin
            })
        }).then(res => res.json()).then(data => {
            // console.log(data.visual_matches)
            console.log(data)
            if(data.search_metadata.status != 'Success'){
                console.log('no success')
                return   
            }
            // data.knowledge_graph[0].title
            // pkmnscreen.img.src = data.knowledge_graph[0].images[0].link
            // data.text_results
            // data.visual_matches
            var cardmarketmatches = data.visual_matches.filter(vm => vm.source.includes('cardmarket'))
            if(cardmarketmatches.length > 0){
                var cardmarketMatch = cardmarketmatches[0]
                pkmnscreen.title.innerText = cardmarketMatch.title
                pkmnscreen.link.innerText = 'cardmarket.com'//cardmarketMatch.title
                pkmnscreen.link.href = cardmarketMatch.link
                
                
                // cardmarketMatch.price.currency
                // cardmarketMatch.price.extracted_value
                // cardmarketMatch.price.value
                pkmnscreen.img.src = cardmarketMatch.thumbnail
            }else{
                var othersitematch = data.visual_matches[0]
                pkmnscreen.title.innerText = othersitematch.title
                pkmnscreen.link.innerText = othersitematch.source
                pkmnscreen.link.href = othersitematch.link
                pkmnscreen.img.src = othersitematch.thumbnail

            }
            console.log(cardmarketmatches)
        })

        
    }
}

class PokemonScreen{
    constructor(){
        this.root = document.createElement('div')
        this.root.style = 'height:100%;'
        startContext(this.root)

        div({style:`
            background:#fe0065;
            display: flex;
            flex-direction: column;
            align-items: center;
            height:100%;
            justify-content: space-between;
        `})
            this.title = crend('h2','',{style:'text-align:center;'})
            this.img = img({src:mewtwoimgurl,style:'flex-grow:1;'})
            this.link = crend('a','',{href:'',target:'_blank',style:'margin:25px; font-size:35px;'})
            //cardmarket link
        end()
        endContext()
    }
}




var accountscreen = new AccountScreen()
var scanscreen = new ScanScreen()
var pkmnscreen = new PokemonScreen()

div({style:'display:flex;flex-direction:column; height:100vh;overflow:hidden; aspect-ratio:2/3;'})

    let maindiv = div({style:'width:100%;height:80vh; flex-grow:1;'})//scanner
        
        
        
    end()

    div({style:'display:flex;justify-content:space-around; align-items:center; height:50px; font-size:25px; font-weight:bold;'})//bottom bar
        let acntbutton = crend('img','',{src:'/images/user-solid.svg', style:"width:40px;"}).on('click', e => {
            maindiv.innerHTML = ''
            maindiv.appendChild(accountscreen.root)
        })
        let scanbtn = crend('img','',{src:'/images/camera-solid.svg', style:"width:40px;"}).on('click', e => {
            maindiv.innerHTML = ''
            maindiv.appendChild(scanscreen.root)
            scanscreen.videoel.play()
        })
        let pkmnbtn = crend('span','pkmn').on('click', e => {
            maindiv.innerHTML = ''
            maindiv.appendChild(pkmnscreen.root)
        })

        
    end()
end()

maindiv.appendChild(scanscreen.root)

navigator.serviceWorker.register('/serviceworker.js')








var simipourtestdata


