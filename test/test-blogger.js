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

describe('blogger', function() {
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
            .get('/blogger')
            .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');

            expect(res.body.length).to.be.at.least(1);

            const expectKeys = ['title', 'content', 'publishDate'];
            res.body.forEach(function(item) {
                expect(item).to.be.a('object');
                expect(item).to.include.keys(expectedKeys);
            });
        });
    });
    
    it('should add an item on POST', function() {
        const newItem = {title: 'testpost', content: 'test content'};
        return chai.request(app)
          .post('/recipes')
          .send(newItem)
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content');
            expect(res.body.id).to.not.equal(null);
            // response should be deep equal to `newItem` from above if we assign
            // `id` to it from `res.body.id`
            expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
          });
      });

    it('should update items on PUT', function() {
        const updateData = {
            title: 'foo',
            content: 'bizz bang'
        };

        return chai.request(app)
            .get('/blogger')
            .then(function(res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                .put(`/blogger/${updateData.id}`)
                .send(updateData);
            })
            // prove that the PUT request has right status code
            // and returns updated item
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        });
    it('should delete items on DELETE', function() {
        return chai.request(app)
              // first have to get so we have an `id` of item
              // to delete
            .get('/blogger')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/blogger/${res.body[0].id}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
        });
});