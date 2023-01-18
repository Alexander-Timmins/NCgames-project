"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var seed = require('../db/seeds/seed');

var app = require('../app');

var request = require('supertest');

var db = require('../db/connection');

var data = require('../db/data/test-data');

beforeEach(function () {
  return seed(data);
});
afterAll(function () {
  db.end();
});
describe('app.js', function () {
  describe('/api', function () {
    test('/api returns a string "Api ready to serve"', function () {
      return request(app).get('/api').expect(200).then(function (response) {
        expect(response.text).toBe('Api ready to serve');
      });
    });
  });
  describe('3. GET /api/categories', function () {
    test('returns an object with key of categories and value of object', function () {
      return request(app).get('/api/categories').expect(200).then(function (response) {
        expect(_typeof(response.body)).toBe('object');
        expect(response.body.hasOwnProperty('categories')).toBe(true);
        expect(_typeof(response.body.categories)).toBe('object');
      });
    });
    test('returns an object with values equal to all categories in the database', function () {
      return request(app).get('/api/categories').expect(200).then(function (response) {
        expect(response.body.categories.length).toBe(4);
        expect(response.body.categories.forEach(function (catagory) {
          expect(catagory).toEqual(expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String)
          }));
        }));
      });
    });
  });
  describe('4. GET /api/reviews', function () {
    test('returns object with key of reviews', function () {
      return request(app).get('/api/reviews').expect(200).then(function (response) {
        expect(_typeof(response.body)).toBe('object');
        expect(response.body.hasOwnProperty('reviews')).toBe(true);
      });
    });
    test('returns a list of reviews in an object key with array values', function () {
      return request(app).get('/api/reviews').expect(200).then(function (response) {
        expect(response.body.reviews.forEach(function (review) {
          expect(review).toEqual(expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            category: expect.any(String),
            votes: expect.any(Number),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            designer: expect.any(String),
            comment_count: expect.any(Number)
          }));
        }));
      });
    });
  });
  describe('5. GET /api/reviews/:review_id', function () {
    test('should return a 404 error if the review is not found', function () {
      return request(app).get('/api/review/999').expect(404).then(function (response) {
        expect(response.body.message).toBe('Not found');
      });
    });
    test('should return a 400 error if the format of the review is incorrect', function () {
      return request(app).get('/api/review/banana').expect(400).then(function (response) {
        expect(response.body.message).toBe('Invalid request made');
      });
    });
    test('returns a specific review by review_Id reference', function () {
      var review3 = {
        review_id: 3,
        title: 'Ultimate Werewolf',
        category: 'social deduction',
        designer: 'Akihisa Okui',
        owner: 'bainesface',
        review_body: "We couldn't find the werewolf!",
        review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
        created_at: '2021-01-18T10:01:41.251Z',
        votes: 5,
        comment_count: 3
      };
      return request(app).get('/api/review/3').expect(200).then(function (response) {
        expect(response.body).toEqual(review3);
        expect(_typeof(response.body)).toBe('object');
        expect(response.body.review_id).toBe(3);
        expect(response.body).toEqual(expect.objectContaining({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
          comment_count: expect.any(Number)
        }));
      });
    });
  });
  describe('6. GET /api/reviews/:review_id/comments', function () {
    test('returns a list of comments for a specific given review', function () {
      return request(app).get('/api/3/comments').expect(200).then(function (response) {
        expect(Array.isArray(response.body.comments)).toBe(true);
        expect(response.body.comments.length).toBe(3);
        expect(response.body.comments.forEach(function (comment) {
          expect(comment).toEqual(expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            review_id: expect.any(Number),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String)
          }));
        }));
      });
    });
    test('returns a 404 if given a correct value but out of the scope for review list', function () {
      return request(app).get('/api/999/comments').expect(404).then(function (response) {
        expect(response.body.message).toBe('Not found');
      });
    });
    test('returns a 400 if given an invalid request', function () {
      return request(app).get('/api/banana/comments').expect(400).then(function (response) {
        expect(response.body.message).toBe('Invalid request made');
      });
    });
  });
  describe('7. POST /api/reviews/:review_id/comments', function () {
    var newComment = {
      username: 'bainesface',
      body: 'This is a comment'
    };
    test('returns a posted comment', function () {
      return request(app).post('/api/review/3/comments').send(newComment).expect(201).then(function (response) {
        expect(Array.isArray(response.body.comment)).toBe(false);
        expect(_typeof(response.body.comment)).toBe('object');
        expect(response.body.comment).toEqual(expect.objectContaining({
          author: expect.any(String),
          body: expect.any(String),
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          review_id: expect.any(Number),
          votes: expect.any(Number)
        }));
      });
    });
    test('returns a 404 if given a correct value but out of the scope for review list', function () {
      return request(app).post('/api/review/9999/comments').send(newComment).expect(404).then(function (response) {
        expect(response.body.message).toBe('Not found');
      });
    });
    test('returns a 400 if given an invalid request', function () {
      return request(app).post('/api/review/banana/comments').send(newComment).expect(400).then(function (response) {
        expect(response.body.message).toBe('Invalid request made');
      });
    });
    test('returns a 400 if body or username missing from post request', function () {
      newComment = {
        random: 'bainesface',
        body: 'This is a comment'
      };
      return request(app).post('/api/review/3/comments').send(newComment).expect(400).then(function (response) {
        expect(response.body.message).toBe('Invalid request made');
      });
    });
  });
  describe('8. PATCH /api/reviews/:review_id', function () {
    test('returns the updated review', function () {
      var votesToUpdate = {
        inc_votes: 1000
      };
      return request(app).patch('/api/review/3').send(votesToUpdate).expect(202).then(function (response) {
        expect(response.body).toEqual({
          updatedReview: [{
            category: 'social deduction',
            created_at: '2021-01-18T10:01:41.251Z',
            designer: 'Akihisa Okui',
            owner: 'bainesface',
            review_body: "We couldn't find the werewolf!",
            review_id: 3,
            review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
            title: 'Ultimate Werewolf',
            votes: 1005
          }]
        });
      });
    });
    test('returns a status 400 when passed an invalid query', function () {
      var votesToUpdate = {
        inc_votes: 1000
      };
      return request(app).patch('/api/review/banana').send(votesToUpdate).expect(400);
    });
    test('returns a status 404 when passed a review ID that does not exist', function () {
      var votesToUpdate = {
        inc_votes: 1000
      };
      return request(app).patch('/api/review/999').send(votesToUpdate).expect(404);
    });
    test('returns a status 400 when passed an invalid body', function () {
      var votesToUpdate = {
        random: 1000
      };
      return request(app).patch('/api/review/3').send(votesToUpdate).expect(400);
    });
  });
  describe('9. GET /api/users', function () {
    test('returns an array of objects', function () {
      return request(app).get('/api/users').expect(200).then(function (response) {
        expect(Array.isArray(response.body)).toBe(true);
        expect(_typeof(response.body[0])).toBe('object');
        expect(response.body.length).toBe(4);
      });
    });
    test('returns each object containing specified properties', function () {
      return request(app).get('/api/users').expect(200).then(function (response) {
        expect(response.body.forEach(function (catagory) {
          expect(catagory).toEqual(expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          }));
        }));
      });
    });
  });
  describe('10. GET /api/reviews (queries)', function () {
    test('returns an array of objects where each object category is equal to the query', function () {
      return request(app).get('/api/reviews?category=social deduction').expect(200).then(function (response) {
        expect(Array.isArray(response.body.reviews)).toBe(true);
        expect(response.body.reviews.length).toBe(11);
        expect(response.body.reviews.forEach(function (review) {
          expect(_typeof(review)).toBe('object');
          expect(review).toEqual(expect.objectContaining({
            owner: expect.any(String),
            designer: expect.any(String),
            category: expect.toBeString('social deduction')
          }));
        }));
      });
    });
    test('returns a 404 error when category is not found', function () {
      return request(app).get('/api/reviews?category=rpg').expect(404).then(function (response) {
        expect(response.body.message).toBe('No matching results found');
      });
    });
    test('returns a 400 error when trying to sort by invalid column', function () {
      return request(app).get('/api/reviews?sort_by=banana').expect(400).then(function (response) {
        expect(response.body.message).toBe('Invalid sorting query');
      });
    });
  });
});