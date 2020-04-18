import { search, searchByTag, searchByType, searchByName } from '../src/index';
import { expect } from 'chai';
import nock from 'nock';

import 'mocha';

describe('Search', () => {
  describe('searchByName', () => {
    let nextPage: Function;

    it('Pagination', async function () {
      nock('https://packagist.org')
        .get('/search.json?q=wp-graphql')
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
  });

  describe('searchByTag', () => {
    let nextPage: Function;

    it('PAgination', async function () {
      nock('https://packagist.org')
        .get('/search.json?tags=graphql')
        .replyWithFile(200, __dirname + `/mocks/searchByTagPage1.json`, {
          'Content-Type': 'application/json',
        });

      const result = await searchByTag('graphql');
      expect(result).to.have.keys(['results', 'total', 'next']);
      expect(result.next).to.be.a('function');

      if (result.next) {
        nock('https://packagist.org')
          .get('/search.json?tags%5B0%5D=graphql&page=2')
          .replyWithFile(200, __dirname + `/mocks/searchByTagPage2.json`, {
            'Content-Type': 'application/json',
          });

        const result2 = await result.next();

        expect(result2).to.have.keys(['results', 'total']);
        expect(result2).not.to.have.key('next');
      }
    });
  });

  describe('searchByType', () => {
    let nextPage: Function;
    it('Pagination', async function () {
      nock('https://packagist.org')
        .get('/search.json?type=plugin')
        .replyWithFile(200, __dirname + `/mocks/searchByTypePage1.json`, {
          'Content-Type': 'application/json',
        });

      const result = await searchByType('plugin');
      expect(result).to.have.keys(['results', 'total', 'next']);
      expect(result.next).to.be.a('function');

      if (result.next) {
        nock('https://packagist.org')
          .get('/search.json?type=plugin&page=2')
          .replyWithFile(200, __dirname + `/mocks/searchByTypePage2.json`, {
            'Content-Type': 'application/json',
          });

        const result2 = await result.next();

        expect(result2).to.have.keys(['results', 'total']);
        expect(result2).not.to.have.key('next');
      }
    });
  });

  describe('search (any)', () => {
    it('Pagination', async function () {
      nock('https://packagist.org')
        .get('/search.json?&q=mail&type=wordpress-plugin&tags=wordpress')
        .replyWithFile(200, __dirname + `/mocks/searchByAnyPage1.json`, {
          'Content-Type': 'application/json',
        });

      const result = await search({ name: 'mail', type: 'wordpress-plugin', tags: 'wordpress' });
      expect(result).to.have.keys(['results', 'total', 'next']);
      expect(result.next).to.be.a('function');

      nock('https://packagist.org')
        .get('/search.json?&q=mail&type=wordpress-plugin&tags%5B0%5D=wordpress&page=2')
        .replyWithFile(200, __dirname + `/mocks/searchByAnyPage2.json`, {
          'Content-Type': 'application/json',
        });

      if (result.next) {
        const result2 = await result.next();

        expect(result2).to.have.keys(['results', 'total']);
        expect(result2).not.to.have.key('next');
      }
    });
  });
});
