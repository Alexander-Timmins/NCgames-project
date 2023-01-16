const seed = require('../db/seeds/seed');
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const data = require('../db/data/test-data');

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  db.end();
});

describe('app.js', () => {
  describe('/api', () => {
    test('/api returns a string "Api ready to serve"', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
          expect(response.text).toBe('Api ready to serve');
        });
    });
  });

  describe('/api/categories', () => {
    test('returns a list of categories in an object key with array values', () => {
      return request(app)
        .get('/api/categories')
        .expect(200)
        .then((response) => {
          expect(typeof response.body).toBe('object');
          expect(response.body.categories.length).toBe(4);
          expect(
            response.body.categories.forEach((catagory) => {
              expect(catagory).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                })
              );
            })
          );
        });
    });
  });
  describe('/api/reviews', () => {
    test('returns a list of reviews in an object key with array values', () => {
      return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((response) => {
          expect(typeof response.body).toBe('object');
          expect(response.body.reviews.length).toBe(13);
          expect(
            response.body.reviews.forEach((review) => {
              expect(review).toEqual(
                expect.objectContaining({
                  review_id: expect.any(Number),
                  title: expect.any(String),
                  category: expect.any(String),
                  votes: expect.any(Number),
                  owner: expect.any(String),
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  designer: expect.any(String),
                })
              );
            })
          );
        });
    });
  });
  describe('/api/:review_Id/comments', () => {
    test('returns a list of comments for a specific given review', () => {
      return request(app)
        .get('/api/3/comments')
        .expect(200)
        .then((response) => {
          expect(typeof response.body).toBe('object');
          expect(response.body.comments.length).toBe(3);
          expect(
            response.body.comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  body: expect.any(String),
                  review_id: expect.any(Number),
                  votes: expect.any(Number),
                  author: expect.any(String),
                  created_at: expect.any(String),
                })
              );
            })
          );
        });
    });
  });
});
