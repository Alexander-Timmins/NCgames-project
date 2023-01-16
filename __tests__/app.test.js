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
    test('returns a specific review by review_Id reference', () => {
      const review3 = [
        {
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
        },
      ];
      return request(app)
        .get('/api/review/3')
        .expect(200)
        .then((response) => {
          expect(typeof response.body).toBe('object');
          expect(response.body.requestedReview).toEqual(review3);
          expect(response.body.requestedReview[0]).toEqual(
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
            })
          );
        });
    });
  });
});
