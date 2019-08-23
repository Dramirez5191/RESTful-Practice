const bodyParser = require('body-parser'),
methodOverride   = require('method-override'),
expressSanitizer        = require('express-sanitizer'),
mongoose         = require('mongoose'),
express          = require('express'),
app              = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/fruits_app", {useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// MODEL CONFIG
let fruitSchema = new mongoose.Schema({
  name: String,
  image: String,
  bio: String
});
Fruit = mongoose.model('fruit', fruitSchema);

//ROUTES
app.get('/', function(req,res){
  res.redirect('/fruits');
});

//INDEX ROUTE
app.get('/fruits', function(req, res){
  Fruit.find({}, function(err,fruits){
    if (err) {
      console.log(err);
    }else {
      res.render('index', {fruits: fruits});
    }
  });
});

// NEW ROUTE
app.get('/fruits/new', function(req,res){
  res.render('new');
});

//Create ROUTE
app.post('/fruits', function(req,res){
  req.body.fruit.bio = req.sanitize(req.body.fruit.bio)
  Fruit.create(req.body.fruit, function(err, newFruit){
    if (err) {
      res.render('new');
    }else {
      res.redirect('/fruits')
    }
  });
});

//SHOW ROUTE
app.get('/fruits/:id',function(req,res){
  Fruit.findById(req.params.id, function(err, foundFruit){
    if (err) {
      res.redirect("/fruits")
    } else {
      res.render("show", {fruit: foundFruit});
    }
  });
});

//EDIT ROUTE
app.get('/fruits/:id/edit', function(req,res){
  Fruit.findById(req.params.id, function(err, foundFruit){
    if (err) {
      res.redirrect('/fruits');
    } else {
      res.render('edit', {fruit: foundFruit});
    }
  });
});

//UPDATE ROUTE
app.put('/fruits/:id', function(req,res){
  req.body.fruit.bio = req.sanitize(req.body.fruit.bio)
  // blod.findByIdAndUpdate(id, newData, callBack)
  Fruit.findByIdAndUpdate(req.params.id, req.body.fruit, function(err, updatedFruit){
    if (err) {
      // poor error handling
      res.redirect('/fruits');
    } else {
      res.redirect('/fruits/' + req.params.id);
    }
  });
});

//DELETE ROUTE
app.delete('/fruits/:id', function(req,res){
    Fruit.findByIdAndRemove(req.params.id, function(err){
      if (err) {
        res.redirect('/fruits');
      }else {
        res.redirect('/fruits');
      }
    });
});

app.listen(3002, function(){
  console.log("listening on port 3002");
});
