// //import chai, declare expect variable
// const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');

//destructur the server.js
const {app, runServer, closeServer} = require('../server');

//so we can use expect from chi
const expect = chai.expect;

//to make HTTP request in chai
chai.use(chaiHttp);

//NOTE make sure you name this right, -1hr of life
describe('blogposts', function() {
    //turn on the server before the test runs
    //return a prommis or else your going to have to mess with the done location stuff
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });


    it('should list items on GET', function() {
        return chai.request(app)
            .get('/blogposts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.above(0);
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.have.all.keys(
                        //NOTE had to add author was messing up
                        'id', 'title', 'content', 'author', 'publishDate')
                });
            });
    });
    
    it('should add an item on POST', function() {
        const newItem = {title: 'testpost', content: 'test content', author: 'Mrs. Fizzbuzz'};
        const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newItem));
        return chai.request(app)
            .post('/blogposts')
            .send(newItem)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.all.keys(expectedKeys);
                // expect(res.body.id).to.not.equal(null);
                expect(res.body.title).to.equal(newItem.title);
                expect(res.body.content).to.equal(newItem.content);
                expect(res.body.author).to.equal(newItem.author)
                // response should be deep equal to `newItem` from above if we assign
                // `id` to it from `res.body.id`
                // expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
          });
      });

    it('should update items on PUT', function() {
        return chai.request(app)
            .get('/blogger')
            .then(function(res) {
                const updateData = Object.assign(res.body[0], {
                    title: 'foo',
                    content: 'bizz bang'
                });
                // updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blogger/${res.body[0].id}`)
                    .send(updateData)
                    .then(function(res) {
                        expect(res).to.have.status(204);
                    });
            // prove that the PUT request has right status code
            // and returns updated item
            });
    });
    it('should delete items on DELETE', function() {
        return chai.request(app)
              // first have to get so we have an `id` of item
              // to delete
            .get('/blogger')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/blogger/${res.body[0].id}`)
                    .then(function(res) {
                        expect(res).to.have.status(204);
                    });
            });
    });
});