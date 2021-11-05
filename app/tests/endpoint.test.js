/* eslint-disable no-undef */
const supertest = require('supertest');
const { app, db } = require('../app');
const User = require('../models/user');
const Movie = require('../models/movie');

const request = supertest(app);

// подготовка тестовых данных
let token = '';
const userTextFixture = {
  name: 'test', email: 'unittest@unittest.test', password: 'test', newname: 'newtest', newEmail: 'newunittest@unittest.test',
};
const wrongUserFixture = {
  name: 'test2', email: 'unittest2@unittest.test', password: 'test2', newname: 'newtest2',
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
    const req = request.get('/healthcheck')
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({ message: 'OK!' });
      });
    return req;
  });

  it('[positive] Not found', () => {
    const req = request.get('/dummy')
      .then((response) => {
        expect(response.status).toBe(404);
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

  it('При обновлении данных пользователя с использованием почтового ящика, который принадлежит другому юзеру, необходимо возвращать ошибку 409', () => {
    const req = request.patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: userTextFixture.newname, email: wrongUserFixture.email })
      .then((response) => {
        expect(response.status).toBe(409);
      });
    return req;
  });

  it('Обновление имени пользователя без передачи нового имени завершается должна возвращаться ошибка 400', () => {
    const req = request.patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: userTextFixture.newEmail })
      .then((response) => {
        expect(response.status).toBe(400);
      });
    return req;
  });

  it('Обновление почтового ящика без передачи нового почтового ящика должна возвращаться ошибка 400', () => {
    const req = request.patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: userTextFixture.name })
      .then((response) => {
        expect(response.status).toBe(400);
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

  it('Удаление фильма с невалидным id test4583q0d2574b5862test должно быть 400', () => {
    const req = request.delete('/movies/test4583q0d2574b5862test')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(400);
      });
    return req;
  });

  it('Удаление фильма с невалидным id abc должно быть 400', () => {
    const req = request.delete('/movies/abc')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(400);
      });
    return req;
  });
});
