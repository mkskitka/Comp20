var express = require('express');
var app = express();
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var uri = 'mongodb://heroku_hrlt9p2b:ciu3131gcbehkjlr1cuiatdd1d@ds023550.mlab.com:23550/heroku_hrlt9p2b';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.sendFile(__dirname + 'public/index.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
app.post('/sendRecipe', function(request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");
  var title = request.body.recipe;
  var imgName = request.body.photo;
  var image = request.body.bitImage;
  var cookTime = request.body.cookTime;
  var difficulty = request.body.difficulty;
  var tag1 = request.body.tag1;
  var tag2 = request.body.tag2;
  var tag3 = request.body.tag3;
  var ingredients = request.body.ingredients;
  var instructions = request.body.instructions;
  var created_at = new Date();
  var toInsert = {
    "title": title,
    "imgName": imgName,
    "image": image,
    "cookTime": cookTime,
    "difficulty": difficulty,
    "tag1": tag1,
    "tag2": tag2,
    "tag3": tag3,
    "ingredients": ingredients,
    "instructions": instructions,
    "created_at": created_at
  };
    mongodb.MongoClient.connect(uri, function(err, db) {
    db.collection('recipes', function(error, coll) {
      var id = coll.insert(toInsert, function(error, saved) {
        if (error) {
          response.sendStatus(500);
        } else {
          response.writeHead(301,
            {Location: '/index.html'}
          );
          response.end();;
        }
      });
    });
  });
});

app.get('/getRecipes', function(request, response){//for home page
  response.set('Content-Type', 'application/json');
  var data = new Array();
  db.collection('recipes', function(error, coll){
    if(!error){
      coll.find({created_at: -1}).toArray(function(err, cursor){
        if(cursor){
          for (var count = 0; count < cursor.length; count++) {
              data[data.length] = cursor[count];
            }
          response.send(data);
        }
        else{
          response.sendStatus(500);
        }
      });
    }
  });
});
app.post('/getTags', function(request, response){//on home page with limited search feature
      var tag = request.body.tag;
      var data = new Array();
      db.collection('users', function(error, coll){
        if(!error){
          coll.find({created_at: -1}).toArray(function(err, cursor){
            if(cursor){
              for (var count = 0; count < cursor.length; count++) {//inorder
                  if(cursor[count].tag1 == tag || cursor[count].tag2 == tag || cursor[count].tag3 == tag){
                      data[data.length] = cursor[count];
                  }
               }
               send(data);
            }
            else{
              response.sendStatus(500);
            }
          });
        }
      });
  });