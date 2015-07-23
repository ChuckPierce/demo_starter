var GitHubApi = require("github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
});
github.user.getFollowingFromUser({
    user: "chuckpierce"
}, function(err, res) {
    console.log(JSON.stringify(res));
});
