var CommentAPI = require('./CommentAPI.js');
var CommentParser = require('./CommentParser.js');

/* Constrctor */
var CommentScraper = function(videoID, callback) {
	var self = this;
	this.videoID = videoID;
	this.commentCount = 0;
	
	this.commentAPI = new CommentAPI(videoID, function(error){
		if(error) 
			return callback(error);

		self.commentParser = new CommentParser(self.commentAPI);
		callback();
	});
};

/* retrieves all comments on the page specified by pageToken
 * if no pageToken is given, it will get the comments from the first page.
 * the callback passes the comments in an array and the token for the next consecutive page */
CommentScraper.prototype.getCommentPage = function(pageToken, callback) {
	var self = this;

	console.log("--Requesting Comment Page " + pageToken);
	this.commentAPI.getCommentPage(pageToken, function(error, pageContent, nextPageToken) {
		if(error)
			return callback(error);

		self.nextPageToken = nextPageToken;
		self.callback = callback;

		console.log("--Parsing Comment Page");
		self.commentParser.parse(pageContent, function(error, commentsArr){
			if(error)
				return self.callback(error);

			self.callback(null, commentsArr, self.nextPageToken);
		});
	});
};

module.exports = CommentScraper;