// #### Controller setup
console.log('establishing routes');
var express = require("express");
var router = express.Router();
var cheerio = require("cheerio");
var request = require("request");


var HighLight = 'style="font-weight:600; color:#007bff"';
var LowLight = 'style="font-weight:100; color:#5e6a77"';
var mod2= require('../models_2/');
var arrOut = [];
class Article {
  constructor(title, summary, link, imglink, saved){
    this.Title = title;
    this.Summary = summary;
    this.Link = link;    
    this.ImgLink = imglink;
    if(!saved){}else{
    this.Saved = {value:true}}
  }
}
const getArticleFromArray = (res, Title,cb) => {

  let MyArt = {};
  for (let Art of arrOut) {   
    if(Art.Title === Title){
      MyArt = Art;
      break;    
    }
  }
  return cb(MyArt, res);
}
const getOldArticles = (res, cb) => {
  
  mod2.Articles.find({},function(dbArt){
    if(dbArt){
    dbArt.forEach(function(art){
      console.log(art);
      let out = new Article(art.Title, art.Summary, art.Link, art.LinkImg, art);
      arrOut.push(out);
    });
     
  }
   
  }).then(function(){cb(res);});
  
}
const getFreshArticles = (res) => {
//get old list from db 
console.log('start');
arrOut.length=0;
console.log('requestive massively');
request("http://massivelyop.com/", function(error, response, html) {
 let $ = cheerio.load(html);
 let iEnd = 8;
$("article.post").each(function(i,element){  
  if(i<iEnd){
  let link = 'http://massivelyop.com/' + $(element).children("h2").children().attr("href");
  let title = $(element).children("h2").text();  
  //let summary = $(element).children("entry").children("p").toString().replace(/<\/?(?!p)\w*\b[^>]*>/g, "").replace(/&#x[^\s][^\s][^\s][^\s];/g,"").replace(/<p> Read more<\/p>|<p> Comment<\/p>/g,"");
  let summary = $(element).children(".entry").children("p").html().replace(/<\/?(?!p)\w*\b[^>]*>/g, "").replace(/&#x[^\s][^\s][^\s][^\s];/g,"").replace(/<p> Read more<\/p>|<p> Comment<\/p>/g,"");
  if(!summary){
    summary = $(element).children(".entry").html().replace(/<\/?(?!p)\w*\b[^>]*>/g, "").replace(/&#x[^\s][^\s][^\s][^\s];/g,"").replace(/<p> Read more<\/p>|<p> Comment<\/p>/g,"");
  }
  let linkimg = $(element).children("a").children("img").attr("src");
  
  if ((!summary)||((summary!==null)&&(summary.length > 100))){
    mod2.Articles.findOne({Title:title}).populate('Notes')
    .then(function(err, dbArticles) {
      // If able to successfully find and associate all Users and Notes, send them back to the client
      let out = new Article(title, summary, link, linkimg, null);
      if(!dbArticles){
      
      }else{
        out = new Article(title, summary, link, linkimg, dbArticles);
      }
      
      
      let bFound = false;
      arrOut.forEach(
        function(art){
          console.log(dbArticle, art);
        }
      );
      if(bFound==false){
        arrOut.push(out);
      }
     
    
    }).catch(function(err){
      console.log('ERR ERR ERR', err);
    });

  } else {if(iEnd<25){iEnd++}};
 
  }
});
console.log('done massively');
console.log('requestive mmorpg');
request("https://www.mmorpg.com/", function(error, response, html) {
    let $ = cheerio.load(html);
    let iEnd = 16;
    $(".newsitem").each(function(i,element){
      if(i<iEnd){
      let link = 'https://www.mmorpg.com/' + $(element).children("h3").children().attr("href");
      let title = $(element).children("h3").text();  
      let summary = $(element).children(".news_newspost").children("p").toString().replace(/<\/?(?!p)\w*\b[^>]*>/g, "").replace(/&#x[^\s][^\s][^\s][^\s];/g,"")
      
      let linkimg = $(element).children(".news_newspost").children("a").children("img").attr("src");
      
      if ((!summary)||((summary!==null)&&(summary.length > 100))){
        mod2.Articles.findOne({Title:title}).populate('Notes')
        .then(function(dbArticles) {
          console.log('ARTICLE: ', dbArticles);
          // If able to successfully find and associate all Users and Notes, send them back to the client
          let out = {};
          if(!dbArticles){
            out = new Article(title, summary, link, linkimg, null);
          }else{
            out = new Article(title, summary, link, linkimg, dbArticles);
          }   

   
          
          arrOut.push(out);
        
        }).catch(function(err){
          console.log('ERR ERR ERR', err);
        });
      } else {if(iEnd<25){iEnd++}};
     
      }
     
     });
     //console.log('Articles---->', arrOut);
     console.log('done mmorpg');   
     var artObject = {
      articles: arrOut,      
      styleHomeLink: HighLight,
      styleSavedLink: LowLight,
      styleAboutLink: LowLight,      
      btnSave: "style='color:white;'"};
       
    console.log('rendermain');
    return res.render("index", artObject);
    })

}) 


}

router.post("/api/note/save/", function(req,res){
  let title = req.body.Title;
  console.log('SAVEME1');  
  let Note = req.body.DataNote;
  console.log('SAVEME2');
  mod2.Notes.create({note:Note}).then(function(dbNote){
           mod2.Articles.findOneAndUpdate({Title:title}, 
           { $push: {NoteIds: dbNote._id }}, { new: true }).then(function(obj){
          
            
              console.log('SAVEME3');
              let MyArt = {};
              let x =0;
              for (let Art of arrOut) {   
                
                if(Art.Title === title){
                  obj.Saved = {value:true};
                  arrOut[x]=obj;
                  break;    
                }
               x++;
              }
              console.log('SAVEME4');
              return res.redirect("/");
            
          }
          );
                    
      
                  });
});

  


router.get("/api/remove/:Tit", function(req,res){
  let title = req.params.Tit;
  if (arrOut.length===0){
    return res.redirect("/");
  }
  mod2.Articles.deleteOne({Title:title},function(err,obj){
    let MyArt = {};
    for (let Art of arrOut) {   
      if(Art.Title === title){
        Art.Saved=null;
        break;    
      }
    }
        return res.redirect("/");
  });    
  });
 
router.get("/api/save/:Tit", function(req,res){
  let title = req.params.Tit;
  if (arrOut.length===0){
    res.redirect("/");
    return;
  }
  mod2.Articles.findOne({Title:title},function(err,obj){

    if(!obj){
      getArticleFromArray(res, title, function(Art, res){
        mod2.Articles.create(Art)
        .then(function(dbGNewsDaily) {
          let x =0;
          for (let Art of arrOut) {   
            if(Art.Title === title){
              Art.Saved={value:true};  
              arrOut[x] = Art;                
              break;    
             }
             x++;
          }
          return res.redirect("/");
       })
      .catch(function(err) {    
        res.json({err});
      });
    });
  }else{
    console.log('obj FOUND');
    return res.redirect("/");
  }
});  
     
});
  
router.get("/api/clear", function(req, res) {  
  mod2.Articles.deleteMany({})
        .then(function(dbGNewsDaily) {
          getFreshArticles(res);  
       });
  
      
});

router.get("/api/freshies", function(req, res) {  
  
    getFreshArticles(res);
  
});

router.get("*", function(req, res) {  
  console.log("*", arrOut.length.toString());
   if(arrOut.length<1){
      //getOldArticles(res, getFreshArticles);      
      getFreshArticles(res);
      return;
    }


      arrOut.forEach(function(art,i){
        
        if(art.NoteIds){          
          art.NoteIds.forEach(function(nte,j){

            mod2.Notes.find({"_id":nte},function(err, notes){
              if(!arrOut[i].txtNote){
                arrOut[i].txtNote = [];
              }
              let bFound = false;
              arrOut[i].txtNote.forEach(function(tNote, k){
                console.log(tNote._id, notes[0]._id);
                if(tNote._id.toString()===notes[0]._id.toString()){
                    bFound=true;
                    console.log('found');
                     
                    }
              })
              if(bFound===false){
                arrOut[i].txtNote.push(notes[0]);
                
                console.log('ARTICLE: ', art._id,' NOTES IN===>', arrOut[i].txtNote);
                
              }
              
              
            })});

        }
        })
       
        var artObject = {
          articles: arrOut,
          styleHomeLink: HighLight,
          styleSavedLink: LowLight,
          styleAboutLink: LowLight,
          btnSave: "style='color:white;'"}
               
        return res.render("index", artObject);
      
    
       
        
         
      
    }
    
);


module.exports=router;

