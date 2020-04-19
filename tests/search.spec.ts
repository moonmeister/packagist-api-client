import 'mocha';
import { expect } from 'chai';
import nock from 'nock';

import { search, searchByTag, searchByType, searchByName } from '../src/index';

describe('Search', () => {
  describe('searchByName', () => {
    it('Pagination', async function () {
      nock('https://packagist.org')
        .get('/search.json')
        .query({
          q: 'wp-graphql',
        })
        .replyWithFile(200, __dirname + `/mocks/searchByNamePage1.json`, {
          'Content-Type': 'application/json',
        });

      const result = await searchByName('wp-graphql');
      expect(result).to.have.keys(['results', 'total', 'next']);
      expect(result.next).to.be.a('function');

      if (result.next) {
        nock('https://packagist.org')
          .get('/search.json?q=wp-graphql&page=2')
          .replyWithFile(200, __dirname + `/mocks/searchByNamePage2.json`, {
            'Content-Type': 'application/json',
          });

        const result2 = await result.next();
        expect(result2).to.have.keys(['results', 'total']);
        expect(result2).not.to.have.key('next');
      }
    });

    it('Pagination Page Size', async function () {
      nock('https://packagist.org')
        .get('/search.json')
        .query({
          q: 'wp-graphql',
          per_page: 10,
        })
        .replyWithFile(200, __dirname + `/mocks/searchByNamePage1.json`, {
          'Content-Type': 'application/json',
        });

      await searchByName('wp-graphql', 10);
    });
  });

  describe('searchByTag', () => {
    it('Pagination', async function () {
      nock('https://packagist.org')
        .get('/search.json')
        .query({
          tags: 'graphql',
        })
        .replyWithFile(200, __dirname + `/mocks/searchByTagPage1.json`, {
          'Content-Type': 'application/json',
        });

      const result = await searchByTag('graphql');
      expect(result).to.have.keys(['results', 'total', 'next']);
      expect(result.next).to.be.a('function');

      if (result.next) {
        nock('https://packagist.org')
          .get('/search.json')
          .query({
            'tags[0]': 'graphql',
            page: 2,
          })
          .replyWithFile(200, __dirname + `/mocks/searchByTagPage2.json`, {
            'Content-Type': 'application/json',
          });

        const result2 = await result.next();

        expect(result2).to.have.keys(['results', 'total']);
        expect(result2).not.to.have.key('next');
      }
    });

    it('Pagination Page Size', async function () {
      nock('https://packagist.org')
        .get('/search.json')
        .query({
          tags: 'graphql',
          per_page: 10,
        })
        .replyWithFile(200, __dirname + `/mocks/searchByTagPage1.json`, {
          'Content-Type': 'application/json',
        });

      await searchByTag('graphql', 10);
    });

    it('Multi Tag Search', async function () {
      nock('https://packagist.org')
        .get('/search.json')
        .query({
          'tags[0]': 'graphql',
          'tags[1]': 'wp-graphql',
        })
        .replyWithFile(200, __dirname + `/mocks/searchByTagPage1.json`, {
          'Content-Type': 'application/json',
        });

      await searchByTag(['graphql', 'wp-graphql']);
    });
  });

  describe('searchByType', () => {
    it('Pagination', async function () {
      nock('https://packagist.org')
        .get('/search.json')
        .query({
          type: 'plugin',
        })
        .replyWithFile(200, __dirname + `/mocks/searchByTypePage1.json`, {
          'Content-Type': 'application/json',
        });

      const result = await searchByType('plugin');
      expect(result).to.have.keys(['results', 'total', 'next']);
      expect(result.next).to.be.a('function');

      if (result.next) {
        nock('https://packagist.org')
          .get('/search.json')
          .query({
            type: 'plugin',
            page: 2,
          })
          .replyWithFile(200, __dirname + `/mocks/searchByTypePage2.json`, {
            'Content-Type': 'application/json',
          });

        const result2 = await result.next();

        expect(result2).to.have.keys(['results', 'total']);
        expect(result2).not.to.have.key('next');
      }
    });

    it('Pagination Page Size', async function () {
      nock('https://packagist.org')
        .get('/search.json')
        .query({
          type: 'plugin',
          per_page: 10,
        })
        .replyWithFile(200, __dirname + `/mocks/searchByTypePage1.json`, {
          'Content-Type': 'application/json',
        });

      await searchByType('plugin', 10);
    });
  });

  describe('search (any)', () => {
    it('Pagination', async function () {
      nock('https://packagist.org')
        .get('/search.json')
        .query({
          q: 'mail',
          type: 'wordpress-plugin',
          tags: 'wordpress',
        })
        .replyWithFile(200, __dirname + `/mocks/searchByAnyPage1.json`, {
          'Content-Type': 'application/json',
        });

      const result = await search({ name: 'mail', type: 'wordpress-plugin', tags: 'wordpress' });
      expect(result).to.have.keys(['results', 'total', 'next']);
      expect(result.next).to.be.a('function');

      nock('https://packagist.org')
        .get('/search.json')
        .query({
          q: 'mail',
          type: 'wordpress-plugin',
          'tags[0]': 'wordpress',
          page: 2,
        })
        .replyWithFile(200, __dirname + `/mocks/searchByAnyPage2.json`, {
          'Content-Type': 'application/json',
        });

      if (result.next) {
        const result2 = await result.next();

        expect(result2).to.have.keys(['results', 'total']);
        expect(result2).not.to.have.key('next');
      }
    });

    it('Pagination Page Size', async function () {
      nock('https://packagist.org')
        .get('/search.json')
        .query({
          q: 'mail',
          type: 'wordpress-plugin',
          tags: 'wordpress',
          per_page: 10,
        })
        .replyWithFile(200, __dirname + `/mocks/searchByAnyPage1.json`, {
          'Content-Type': 'application/json',
        });

      await search({ name: 'mail', type: 'wordpress-plugin', tags: 'wordpress' }, 10);
    });

    it('Multi Tag Search', async function () {
      nock('https://packagist.org')
        .get('/search.json')
        .query({
          'tags[0]': 'wordpress',
          'tags[1]': 'wp-graphql',
        })
        .replyWithFile(200, __dirname + `/mocks/searchByAnyPage1.json`, {
          'Content-Type': 'application/json',
        });

      await searchByTag(['wordpress', 'wp-graphql']);
    });
  });
});
