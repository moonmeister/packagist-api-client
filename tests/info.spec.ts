import 'mocha';
import { expect } from 'chai';
import nock from 'nock';

import { getPackagistStats, getPackageMetadata, getPackageDetails } from '../src/index';

describe('Info', () => {
  describe('getPackagistStats', () => {
    nock('https://packagist.org')
      .get('/statistics.json')
      .replyWithFile(200, __dirname + `/mocks/getPackagistStats.json`, {
        'Content-Type': 'application/json',
      });

    it('Returns request body', async () => {
      const results = await getPackagistStats();

      expect(results).to.have.key('totals');
    });
  });

  describe('getPackageMetadata', () => {
    it('Returns request body', async () => {
      nock('https://repo.packagist.org')
        .get('/p/moonmeister/wp-graphql-seopress.json')
        .matchHeader('if-modified-since', '')
        .replyWithFile(200, __dirname + `/mocks/getPackageMetadata.json`, {
          'Content-Type': 'application/json',
          'last-modified': 'Fri, 21 Feb 2020 07:47:07 GMT',
        });

      const results = await getPackageMetadata('moonmeister/wp-graphql-seopress');

      expect(results).to.have.keys(['data', 'lastModified']);
      expect(results.data).to.have.key('packages');
      expect(results.lastModified).to.be.a('string');
    });

    it('Properly translates object form of vendor/package input', async () => {
      nock('https://repo.packagist.org')
        .get('/p/moonmeister/wp-graphql-seopress.json')
        .matchHeader('if-modified-since', '')
        .replyWithFile(200, __dirname + `/mocks/getPackageMetadata.json`, {
          'Content-Type': 'application/json',
          'last-modified': 'Fri, 21 Feb 2020 07:47:07 GMT',
        });

      const results = await getPackageMetadata({
        vendor: 'moonmeister',
        package: 'wp-graphql-seopress',
      });

      expect(results).to.have.keys(['data', 'lastModified']);
      expect(results.data).to.have.key('packages');
      expect(results.lastModified).to.be.a('string');
    });

    it('returns empty when no results with if-modified-since', async () => {
      nock('https://repo.packagist.org')
        .get('/p/moonmeister/wp-graphql-seopress.json')
        .matchHeader('if-modified-since', 'Fri, 22 Feb 2020 07:47:07 GMT')
        .replyWithFile(304, __dirname + `/mocks/getPackageMetadata.json`, {
          'Content-Type': 'application/json',
          'last-modified': 'Fri, 21 Feb 2020 07:47:07 GMT',
        });

      const results = await getPackageMetadata(
        {
          vendor: 'moonmeister',
          package: 'wp-graphql-seopress',
        },
        'Fri, 22 Feb 2020 07:47:07 GMT'
      );

      expect(results).to.have.keys(['data', 'lastModified']);
      expect(results.data).to.deep.equal({});
      expect(results.lastModified).to.be.a('string');
    });
  });

  describe('getPackageDetails', () => {
    it('Returns request body', async () => {
      nock('https://packagist.org')
        .get('/packages/moonmeister/wp-graphql-seopress.json')
        .replyWithFile(200, __dirname + `/mocks/getPackageDetails.json`, {
          'Content-Type': 'application/json',
        });

      const results = await getPackageDetails('moonmeister/wp-graphql-seopress');

      expect(results).to.have.key('package');
    });

    it('Properly translates object form of vendor/package input', async () => {
      nock('https://packagist.org')
        .get('/packages/moonmeister/wp-graphql-seopress.json')
        .replyWithFile(200, __dirname + `/mocks/getPackageDetails.json`, {
          'Content-Type': 'application/json',
        });

      const results = await getPackageDetails({
        vendor: 'moonmeister',
        package: 'wp-graphql-seopress',
      });

      expect(results).to.have.key('package');
    });
  });
});
