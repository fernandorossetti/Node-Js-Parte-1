var passport = require('passport');
var passportTwitter = require('passport-twitter');
var TwitterStrategy = passportTwitter.Strategy;

var Usuario = require('../db/user');

var twitterConnection = function(app){
	passport.use(
		new TwitterStrategy({
			consumerKey: '123124',
			consumerSecret: 'dfgdfh',
			callbackURL: '23423tfgsd'
		},
		function(token, tokenSecret, profile, done){
			Usuario.findOne({
				'twitter.id': profile.id
			},
			function(err, user){
				if(err){
					return done(err);
					console.log(err);
				}
				if(!user){
					var usuario = new Usuario({
						username: profile.username,
						twitter: profile
					});
					var datos = JSON.stringify(eval("("+profile._raw+")"));
					usuario.nombre = JSON.parse(datos).name;

					usuario.save(function(err, user){
						if(err){
							done(err, null);
							return;
							console.log(err);
						}
						done(null, user);
					});
				}else{
					return done(err, user);
					console.log(err);
				}
			});
		}));
	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter',{successRedirect: '/galery', failureRedirect: '/error', failureFlash: 'Error...'}));
};

module.exports = twitterConnection;