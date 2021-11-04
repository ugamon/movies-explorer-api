/* eslint-disable no-undef */
const supertest = require('supertest');
const { app, db } = require('../app');
const User = require('../models/user');
const Movie = require('../models/movie');

const request = supertest(app);

// подготовка тестовых данных
let token = '';
const userTextFixture = {
  name: 'test', email: 'unittest@unittest.test', password: 'test', newname: 'newtest',
};
const movieTextFixture = {
  country: 'test',
  director: 'test',
  duration: 1,
  year: '1900',
  description: 'test',
  image: 'http://test.com',
  trailer: 'http://test.com',
  thumbnail: 'http://test.com',
  nameRU: 'test',
  nameEN: 'test',
  movieId: 1,
};

afterAll(() => {
  db.disconnect();
});

// тестовые наборы данных
describe('--- Эндпоинты пользователя ---', () => {
  afterAll(() => {
    const user = User.deleteOne({ email: userTextFixture.email });
    return user;
  });

  it('[positive] Healthcheck', () => {
    const req = request.get('/')
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({ message: 'OK!' });
      });
    return req;
  });

  it('[positive] /signup', () => {
    const req = request.post('/signup')
      .send({
        name: userTextFixture.name,
        email: userTextFixture.email,
        password: userTextFixture.password,
      })
      .then((response) => {
        expect(response.body).toStrictEqual({
          name: userTextFixture.name,
          email: userTextFixture.email,
        });
      });
    return req;
  });

  it('[negative InvalidData] /signup', () => {
    const req = request.post('/signup')
      .send({
        name: userTextFixture.name,
        email: 'test',
        password: userTextFixture.password,
      })
      .then((response) => {
        expect(response.status).toBe(400);
      });
    return req;
  });

  it('[positive] /signin', () => {
    const req = request.post('/signin')
      .send({ email: userTextFixture.email, password: userTextFixture.password })
      .then((response) => {
        token = response.body.token;
        expect(Object.keys(response.body)).toContain('token');
      });
    return req;
  });

  it('[negative LoginFailed] /signin', () => {
    const req = request.post('/signin')
      .send({
        email: userTextFixture.email,
        password: '12345',
      })
      .then((response) => {
        expect(response.status).toBe(401);
      });
    return req;
  });

  it('[positive] get /users/me', () => {
    const req = request.patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: userTextFixture.newname, email: userTextFixture.email })
      .then(({ body }) => {
        expect(body).toStrictEqual({
          name: userTextFixture.newname, email: userTextFixture.email,
        });
      });
    return req;
  });

  it('[positive] change /users/me', () => {
    const req = request.patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: userTextFixture.newname, email: userTextFixture.email })
      .then(({ body }) => {
        expect(body).toStrictEqual({
          name: userTextFixture.newname, email: userTextFixture.email,
        });
      });
    return req;
  });
});

describe('--- Эндпоинты фильмов ---', () => {
  let filmId = '';

  afterAll(() => {
    const movies = Movie.deleteOne({ _id: filmId });
    return movies;
  });

  it('[positive] create /movies', () => {
    const req = request.post('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send(movieTextFixture)
      .then(({ body }) => {
        filmId = body._id;
        const { _id, ...rest } = body;
        expect(rest).toStrictEqual(movieTextFixture);
      });
    return req;
  });

  it('[negative AuthErr] create /movies', () => {
    const req = request.post('/movies')
      .send(movieTextFixture)
      .then((response) => {
        expect(response.status).toBe(401);
      });
    return req;
  });

  it('[negative EmptyBody] create /movies', () => {
    const req = request.post('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .then((response) => {
        expect(response.status).toBe(400);
      });
    return req;
  });

  it('[negative WrongLink] create /movies', () => {
    const { image, ...rest } = movieTextFixture;
    const req = request.post('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send({ image: 'test.com', ...rest })
      .then((response) => {
        expect(response.status).toBe(400);
      });
    return req;
  });

  it('[positive] get /movies', () => {
    const req = request.get('/movies')
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => {
        expect(body[0]._id).toBe(filmId);
      });
    return req;
  });

  it('[positive] delete /movie/:movieid', () => {
    const req = request.delete(`/movies/${filmId}`)
      .set('Authorization', `Bearer ${token}`)
      .then(({ body }) => {
        expect(body.movieId).toBe(movieTextFixture.movieId);
      });
    return req;
  });

  it('[negative InvalidData] delete /movie/:movieid', () => {
    const req = request.delete(`/movies/${filmId}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(404);
      });
    return req;
  });
});
