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
          console.log(response.body);
          expect(typeof response.body).toBe('object');
          expect(response.body.categories.length).toBeGreaterThan(0);
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
          console.log(response.body);
          expect(typeof response.body).toBe('object');
          expect(response.body.reviews.length).toBeGreaterThan(0);
          expect(
            response.body.reviews.forEach((review) => {
              expect(review).toEqual(
                expect.objectContaining({
                  review_id: expect.any(Number),
                  title: expect.any(String),
                  category: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            })
          );
        });
    });
  });
});
