var request = require('request')
var post = require('./posts.js')
 
function url(path) {
    return "http://localhost:3000" + path
}
 
describe('Validate Post Functionality', function() {
 
    it('should give me three or more posts', function(done) {       
        request(url("/posts"), function(err, res, body) {
            expect(res.statusCode).toBe(200);
            expect(JSON.parse(body).length).toBeGreaterThan(2);
            done()
        })
    }, 500)
 
    it('should add two posts with successive post ids, and return the post each time', function(done) {

        var count;//the present length of posts
        request(url("/posts"), function(err, res, body) {
            count = JSON.parse(body).length;
            done()
        })

        //the first new post
        var aPost = {'title': 'title1', body:"body1", author: "author1", id:""}
        request.post({url:url("/post"),json: aPost}, function(err, res, body) {
        	expect(body.id).toBe(count+1);
            expect(body.body).toBe(aPost.body);
            done()
        })

        //the second new post
        var bPost = {'title': 'title2', body:"body2", author: "author2", id:""}
        request.post({url:url("/post"),json: bPost}, function(err, res, body) {
            expect(body.id).toBe(count+2);
            expect(body.body).toBe(bPost.body);
            done()
        })
    }, 200)
 
    it('should return a post with a specified id', function(done) {
            request(url("/posts/2"), function(err, res, body) {
            expect(res.statusCode).toBe(200);
            expect(JSON.parse(body).length).toBe(1);
		done()
	})
	}, 200)

	it('should return nothing for an invalid id', function(done) {
		request(url("/posts/0"), function(err, res, body) {
            expect(res.statusCode).toBe(200);
            expect(JSON.parse(body).length).toBe(0);
            done()
        })
    }, 500)
});