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
  
  describe('/api/review/:review_Id', () => {
    test('should return a 404 error if the review is not found', () => {
      return request(app)
        .get('/api/review/999')
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe('Not found');
        });
    });
    test('should return a 400 error if the format of the review is incorrect', () => {
      return request(app)
        .get('/api/review/banana')
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Bad request');
        });
    });
    test('returns a specific review by review_Id reference', () => {
      const review3 = {
        review_id: 3,
        title: 'Ultimate Werewolf',
        category: 'social deduction',
        designer: 'Akihisa Okui',
        owner: 'bainesface',
        review_body: "We couldn't find the werewolf!",
        review_img_url:
          'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
        created_at: '2021-01-18T10:01:41.251Z',
        votes: 5,
      };

      return request(app)
        .get('/api/review/3')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(review3);
          expect(typeof response.body).toBe('object');
          expect(response.body.review_id).toBe(3);
          expect(response.body).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: expect.any(String),
              owner: expect.any(String),
              created_at: expect.any(String),

  describe('/api/reviews', () => {
    test('returns a list of reviews in an object key with array values', () => {
      return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((response) => {
          console.log(response.body);
          expect(typeof response.body).toBe('object');
          expect(response.body.reviews.length).toBe(4);
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
});