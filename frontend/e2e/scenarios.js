describe('In class End to End Exercise', function() {
	'use strict'

	beforeEach(function() {
		browser.get('/')
	})
	it('Register a new user',function(){
		element.all(by.model('vm.regname')).sendKeys('bd20')
		element.all(by.model('vm.zipcode')).sendKeys('77005')
		element.all(by.model('vm.email')).sendKeys('bd20@rice.edu')
		element.all(by.model('vm.password')).sendKeys('123456')
		element.all(by.model('vm.cpassword')).sendKeys('123456')
		element.all(by.css('[value="Register"]')).click()
		browser.driver.sleep(500);
		var alert = browser.switchTo().alert()
		expect(alert.getText()).toEqual("Successfully Registered")
		alert.accept()
	})
	it('Log in as your test user',function(){
		element.all(by.model('vm.loginUsername')).sendKeys('bd20test')
		element.all(by.model('vm.loginPassword')).sendKeys('center-each-train')
		element.all(by.css('[id="login"]')).first().click()
		expect(element(by.css('[id="mainPage"]')).isPresent()).toBe(true);
	})
	it('Create a new post and validate the post appears in the feed',function(){
		element(by.model('postCtrl.postContent')).sendKeys('This is a post written by protractor')
		element.all(by.css('[id="postPost"]')).click();
		browser.driver.sleep(200);
		expect(element.all(by.css('.post_content')).first().getText()).toEqual('This is a post written by protractor');
	})
	it('Update the status headline and verify the change',function(){
		element(by.model('statusCtrl.newStatus')).sendKeys('This is a status written by protractor')
		element.all(by.css('[id="postStatus"]')).click();
		expect(element(by.css('[id="status"]')).getText()).toEqual('This is a status written by protractor')
	})

	it('add the user "Follower" to the list of followed users and verify the count increases by one',function(){
		element.all(by.css('.follower_content')).count().then(function(count) {
    		var followerCount = count;
    		browser.driver.sleep(200);
			element(by.model('followingCtrl.newFollower')).sendKeys('sep1')
			element(by.css('[id="add_friend"]')).click()
			expect(element.all(by.css('.follower_content')).count()).toEqual(followerCount+1)
  		});
	})
	it('Remove the user "Follower" from the list of followed users and verify the count decreases by one',function(){
		element.all(by.css('.follower_content')).count().then(function(count) {
    		var followerCount = count;
    		browser.driver.sleep(200);
			element.all(by.css('[id="unfollow_btn"]')).first().click()
			expect(element.all(by.css('.follower_content')).count()).toEqual(followerCount-1)
  		});
	})
	it('Search for "Only One Post Like This" and verify only one post shows, and verify the author',function(){
		element(by.model('postCtrl.query')).sendKeys('Only One Post Like This')
		expect(element.all(by.css('.feeds')).count()).toEqual(1)
		expect(element(by.css('.feed_user_name')).getText()).toEqual("Author: bd20test")

	})	
	it('Navigate to the profile view and verify the page is loaded',function(){
		element(by.css('[id="toProfile"]')).click()
		browser.driver.sleep(500);
		expect(element(by.css('[id="profilePage"]')).isPresent()).toBe(true);
	})
	it('Update the users email and verify',function(){
		element.all(by.css('[id="toProfile"]')).click()
		element.all(by.model('profileCtrl.email')).clear()
		element.all(by.model('profileCtrl.email')).sendKeys('bd20@rice.edu.protractor')
		element.all(by.css('[id="changeEmail_btn"]')).click()
		browser.driver.sleep(500);
		var alert = browser.switchTo().alert()
		expect(alert.getText()).toEqual("email modified to bd20@rice.edu.protractor")
		alert.accept()
		expect(element(by.model('profileCtrl.email')).getAttribute('value')).toEqual('bd20@rice.edu.protractor')
	})
	it('Update the users zipcode and verify',function(){
		element.all(by.css('[id="toProfile"]')).click()
		element(by.model('profileCtrl.zipcode')).clear()
		element(by.model('profileCtrl.zipcode')).sendKeys('77777')
		element(by.css('[id="changeZipcode_btn"]')).click()
		browser.driver.sleep(500);
		var alert = browser.switchTo().alert()
		expect(alert.getText()).toEqual("zipcode modified to 77777")
		alert.accept()
		expect(element(by.model('profileCtrl.zipcode')).getAttribute('value')).toEqual('77777')
	})
	it('Update the users password, verify a "will not change" message',function(){
		element.all(by.css('[id="toProfile"]')).click()
		element(by.model('profileCtrl.password')).sendKeys('111111')
		element(by.model('profileCtrl.cpassword')).sendKeys('111111')
		element(by.css('[id="changePassword_btn"]')).click()
		browser.driver.sleep(500);
		var alert = browser.switchTo().alert()
		expect(alert.getText()).toEqual("will not change")
		alert.accept()
	})
})
