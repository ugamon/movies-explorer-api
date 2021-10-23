/* eslint-disable no-undef */
const { emailRegex } = require('../utils/regexDict');

describe('--- Библиотеки ---', () => {
  it('[positive] emailRegex', () => {
    expect(emailRegex.test('email@email.com')).toBe(true);
  });

  it('[negative] emailRegex', () => {
    expect(emailRegex.test('email@email')).toBe(false);
  });
});
