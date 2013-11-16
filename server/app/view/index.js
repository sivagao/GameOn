var mers = require('mers'),
	passport = require('passport');

exports = module.exports = function(app) {

	var apiPath = app.get('api-path'),
		devPath = app.get('dev-path'),
		authPath = app.get('auth-path'),
		mongoDbURI = app.get('mongodb-uri');

	// Dev fixtures
	if ('development' == app.get('env')) {
		app.get(devPath + '/fixtures', require('./FixturesView').init);
	}

	// Local Authentication
	app.post(authPath + '/signin', require('./SignInView').localSignIn);
	app.post(authPath + '/signup', require('./SignUpView').localSignUp);
	app.get(authPath + '/signout', require('./SignOutView').signOut);

	// Facebook Authentication
	app.get(authPath + '/signup/facebook', require('./SignUpView').facebookSignUp);
	app.get(authPath + '/signup/facebook/callback', require('./SignUpView').facebookSignUpCallback);
	app.get(authPath + '/signin/facebook', require('./SignInView').facebookSignIn);
	app.get(authPath + '/signin/facebook/callback', require('./SignInView').facebookSignInCallback);

	// Custom Methods (not CRUD).
	app.post(apiPath + '/match/:matchId/join', require('./MatchView').joinMatch);
	app.post(apiPath + '/match/:matchId/leave', require('./MatchView').leaveMatch);
	app.post(apiPath + '/match', require('./MatchView').newMatch);
	app.del(apiPath + '/match', require('./MatchView').deleteMatch);

	app.get(apiPath + '/search/near', require('./SearchView').searchNear);

	// Create API CRUD using MERS.
	// TODO: Replace MERS with a better solution.
	app.use(apiPath, mers({ uri: mongoDbURI }).rest());
};