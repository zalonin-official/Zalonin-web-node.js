var express=require("express");
var app=express();
var bodyParser = require("body-parser");
var admin=require("firebase-admin");
var Fuse = require('fuse.js');
var serviceAccount = require("./service-account.json");
var logger=require("morgan");

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger("dev"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://zalonin-beta.firebaseio.com'
});
//remove coupon | 
//show n hide male female | remove button | REMOVE COUPON CODE BTN | sign in | apply coupon | get number | select time and date | store data in local storage|
//send data to server and write in DB
// button same size | remove sign in
	// var salonArr=[];
	// var db = admin.database();
	// var ref = db.ref("MERCHANT");
	// ref.on("value", function(snapshot) {
	// var salon=snapshot.val();
	// //console.log(salon);
	// var key=Object.keys(salon);
	// key.forEach(function(key){
	// salonArr.push(salon[key]);
	// //console.log(key);
	// });
	// });
// 	var sat="satvik"
// 	 admin.database().ref('USER/1/'+sat ).set({ //path and node name
//object to save
//      username: 'name',
//      email: 'email',
//   })
// 	function isAuthenticated(req,res,next){
// }
var db = admin.database();
// var ref = db.ref("USER");
// ref.on("value", function(snapshot) {
// var users=snapshot.val();
// //console.log(users);
// var key=Object.keys(users);
// for(var i=0;i<=key.length-1;i++){
// 	if(users[key[i]].USERDETAILS!=undefined){		
// if(users[key[i]].USERDETAILS.phonenoe!=undefined){			
// console.log(users[key[i]].USERDETAILS.phonenoe);
// 	}
// }
// }
// });
// app.get("/a",function(req,res){
// 	var ref = db.ref("MERCHANT");
// 	ref.on("value", function(snapshot) {
// 	 res.render("index1",{salon:snapshot.val()});
// 	}, function (errorObject) {
// 	  console.log("The read failed: " + errorObject.code);
// 	});
// });
// app.post('/createUser',function(req,res){
// function createUser(){
// 	var usernode='SATVIK71A';

// var updates = {};
// updates['/USER/' + usernode+'/WALLET'] = 'loda';
// updates['/USER/' + usernode+'/REFER'] = 'LASSAN';

// admin.database().ref().update(updates);
// }
// createUser();
// createUser();

// });



app.post('/createUser',function(req,res){
	var data=JSON.parse(req.body.firebasetoken);
	console.log(data);

	var usernode;
	var name=data.user.displayName;
	// console.log(name);
	var email=data.additionalUserInfo.profile.email;
	var ep=email.indexOf('@');
	usernode=email.slice(0,ep).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
	// console.log(usernode);

var updates = {};
// updates['/USER/' + usernode+'/WALLET'] = 'loda';
// updates['/USER/' + usernode+'/REFER'] = 'LASSAN';
updates['/USER/' + usernode+'/USERDETAILS/name'] = name;
updates['/USER/' + usernode+'/USERDETAILS/email'] =email;


admin.database().ref().update(updates);

});




app.post('/book',function(req,res){
console.log(JSON.parse(req.body.data));
	var data=JSON.parse(req.body.data);
	var updates = {};
console.log(data.services);
updates['/MERCHANT/'+data.shopnode+'/BOOKINGS/'+data.dateStamp+'/'+data.timeStamp]=data;
// updates['/MERCHANT/'+data.shopnode +'/USERDETAILS/email'] =data.email;

admin.database().ref().update(updates);
// res.send('okreport');
});




app.post('/promo',function(req,res){
var db = admin.database();
	var ref = db.ref("ZALONIN/PROMO");
	ref.on("value", function(snapshot) {
	var code=req.body.upromo;
	var obj=snapshot.val();
	var check=true;
	var key=Object.keys(snapshot.val());
		for(var i=0;i<key.length;i++){
			if(code==key[i]){
			var a= obj[key[i]];
			res.send(a);
			check=false;
			break;
			}
		}
		if(check==true){
			res.send('Not Applicable');
		}
	});
});
// str.replace(/[^a-zA-Z0-9]/g, "");

app.get("/admin",function(req,res){
	var db = admin.database();
	var ref = db.ref("USER");
	ref.on("value", function(snapshot) {
	res.render("admin",{user:snapshot.val()})
	});

});

app.get("/:id",function(req,res){
	var db = admin.database();
    var sal="MERCHANT/"+req.params.id;
	var ref = db.ref(sal);
	ref.on("value",function(snapshot){
	res.render("services",{salon:snapshot.val()});

	});
});


app.get("/",function(req,res){
	var db = admin.database();
	
	var ref = db.ref("MERCHANT");
	ref.on("value", function(snapshot) {
	 res.render("index",{salon:snapshot.val()});
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});
});

app.get("/about-us",function(req,res){
  	res.render("about-us");
});

app.post("/",function(req,res){

//array to be passed to fuse.js
	var salonArr=[];
	var db = admin.database();
	var ref = db.ref("MERCHANT");
	ref.on("value", function(snapshot) {
	var salon=snapshot.val();
	//console.log(salon);
	var key=Object.keys(salon);
	key.forEach(function(key){
	salonArr.push(salon[key]);
	//console.log(key);
	});
	});



	  var options = {
	  shouldSort: true,
	  threshold: 0.2,
	  location: 0,
	  distance: 500,
	  maxPatternLength: 32,
	  minMatchCharLength: 1,
	  keys: [
	  	"LOCATION.address",
	  	"SHOPDETAILS.shopname"
			]
				};
	var fuse = new Fuse(salonArr, options);
	var result = fuse.search(req.body.search);
	res.render("show1",{salon:result});
});

app.listen(3000,function(){
	console.log("Zalonin's server is working just fine!");
});

// #38D6FF
// #ff9933