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

  describe('3. GET /api/categories', () => {
    test('returns an object with key of categories and value of object', () => {
      return request(app)
        .get('/api/categories')
        .expect(200)
        .then((response) => {
          expect(typeof response.body).toBe('object');
          expect(response.body.hasOwnProperty('categories')).toBe(true);
          expect(typeof response.body.categories).toBe('object');
        });
    });
    test('returns an object with values equal to all categories in the database', () => {
      return request(app)
        .get('/api/categories')
        .expect(200)
        .then((response) => {
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

  describe('4. GET /api/reviews', () => {
    test('returns object with key of reviews', () => {
      return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((response) => {
          expect(typeof response.body).toBe('object');
          expect(response.body.hasOwnProperty('reviews')).toBe(true);
        });
    });
    test('returns a list of reviews in an object key with array values', () => {
      return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((response) => {
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
                  comment_count: expect.any(Number),
                })
              );
            })
          );
        });
    });
  });

  describe('5. GET /api/reviews/:review_id', () => {
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
          expect(response.body.message).toBe('Invalid request made');
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
            })
          );
        });
    });
  });

  describe('6. GET /api/reviews/:review_id/comments', () => {
    test('returns a list of comments for a specific given review', () => {
      return request(app)
        .get('/api/3/comments')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.comments)).toBe(true);
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
    test('returns a 404 if given a correct value but out of the scope for review list', () => {
      return request(app)
        .get('/api/999/comments')
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe('Not found');
        });
    });
    test('returns a 400 if given an invalid request', () => {
      return request(app)
        .get('/api/banana/comments')
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid request made');
        });
    });
  });

  describe('7. POST /api/reviews/:review_id/comments', () => {
    let newComment = {
      username: 'bainesface',
      body: 'This is a comment',
    };
    test('returns a posted comment', () => {
      return request(app)
        .post('/api/review/3/comments')
        .send(newComment)
        .expect(201)
        .then((response) => {
          expect(Array.isArray(response.body.comment)).toBe(false);
          expect(typeof response.body.comment).toBe('object');
          expect(response.body.comment).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              body: expect.any(String),
              comment_id: expect.any(Number),
              created_at: expect.any(String),
              review_id: expect.any(Number),
              votes: expect.any(Number),
            })
          );
        });
    });
    test('returns a 404 if given a correct value but out of the scope for review list', () => {
      return request(app)
        .post('/api/review/9999/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe('Not found');
        });
    });
    test('returns a 400 if given an invalid request', () => {
      return request(app)
        .post('/api/review/banana/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid request made');
        });
    });
    test('returns a 400 if body or username missing from post request', () => {
      newComment = {
        random: 'bainesface',
        body: 'This is a comment',
      };
      return request(app)
        .post('/api/review/3/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid request made');
        });
    });
  });

  describe('8. PATCH /api/reviews/:review_id', () => {
    test('returns the updated review', () => {
      const votesToUpdate = {
        inc_votes: 1000,
      };
      return request(app)
        .patch('/api/review/3')
        .send(votesToUpdate)
        .expect(202)
        .then((response) => {
          expect(response.body).toEqual({
            updatedReview: [
              {
                category: 'social deduction',
                created_at: '2021-01-18T10:01:41.251Z',
                designer: 'Akihisa Okui',
                owner: 'bainesface',
                review_body: "We couldn't find the werewolf!",
                review_id: 3,
                review_img_url:
                  'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
                title: 'Ultimate Werewolf',
                votes: 1005,
              },
            ],
          });
        });
    });
    test('returns a status 400 when passed an invalid query', () => {
      const votesToUpdate = {
        inc_votes: 1000,
      };
      return request(app)
        .patch('/api/review/banana')
        .send(votesToUpdate)
        .expect(400);
    });
    test('returns a status 404 when passed a review ID that does not exist', () => {
      const votesToUpdate = {
        inc_votes: 1000,
      };
      return request(app)
        .patch('/api/review/999')
        .send(votesToUpdate)
        .expect(404);
    });
    test('returns a status 400 when passed an invalid body', () => {
      const votesToUpdate = {
        random: 1000,
      };
      return request(app)
        .patch('/api/review/3')
        .send(votesToUpdate)
        .expect(400);
    });
  });
  describe('9. GET /api/users', () => {
    test('returns an array of objects', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(typeof response.body[0]).toBe('object');
          expect(response.body.length).toBe(4);
        });
    });
    test('returns each object containing specified properties', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
          expect(
            response.body.forEach((catagory) => {
              expect(catagory).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String),
                })
              );
            })
          );
        });
    });
  });

  describe('12. DELETE /api/comments/:comment_id', () => {
    test('returns a code 204 and comment deleted', () => {
      return request(app).delete('/api/comments/5').expect(204);
    });
  });

  describe('10. GET /api/reviews (queries)', () => {
    test('returns an array of objects where each object category is equal to the query', () => {
      return request(app)
        .get('/api/reviews?category=social deduction')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.reviews)).toBe(true);
          expect(response.body.reviews.length).toBe(11);
          expect(
            response.body.reviews.forEach((review) => {
              expect(typeof review).toBe('object');
              expect(review).toEqual(
                expect.objectContaining({
                  owner: expect.any(String),
                  designer: expect.any(String),
                  category: expect.toBeString('social deduction'),
                })
              );
            })
          );
        });
    });
    test('returns an array of objects where each object category is social deduction and they are in ascending order by the number of votes', () => {
      return request(app)
        .get('/api/reviews?category=social deduction&sort_by=votes&order=asc')
        .expect(200)
        .then((response) => {
          console.log(response.body);
          expect(Array.isArray(response.body.reviews)).toBe(true);
          expect(response.body.reviews.length).toBe(11);
          expect(response.body.reviews).toBeSortedBy('votes', {
            ascending: true,
          });
          expect(
            response.body.reviews.forEach((review) => {
              expect(typeof review).toBe('object');
              expect(review).toEqual(
                expect.objectContaining({
                  owner: expect.any(String),
                  designer: expect.any(String),
                  category: expect.toBeString('social deduction'),
                })
              );
            })
          );
        });
    });
    test('returns a 404 error when category is not found', () => {
      return request(app)
        .get('/api/reviews?category=rpg')
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe('No matching results found');
        });
    });
    test('returns a 400 error when trying to sort by invalid column', () => {
      return request(app)
        .get('/api/reviews?sort_by=banana')
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid sorting query');
        });
    });
  });
});
