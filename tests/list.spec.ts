import 'mocha';
import { expect } from 'chai';
import nock from 'nock';

import { listAll, listByOrg, listByType } from '../src/index';

describe('List', () => {
  describe('listAll', () => {
    it('Contents', async function () {
      nock('https://packagist.org')
        .get('/packages/list.json')
        .replyWithFile(200, __dirname + `/mocks/listAll.json`, {
          'Content-Type': 'application/json',
        });

      const result = await listAll();
      expect(result).to.have.key('packageNames');
    });
  });

  describe('listByOrg', () => {
    it('Contents', async function () {
      nock('https://packagist.org')
        .get('/packages/list.json?vendor=composer')
        .replyWithFile(200, __dirname + `/mocks/listByOrg.json`, {
          'Content-Type': 'application/json',
        });

      const result = await listByOrg('composer');
      expect(result).to.have.key('packageNames');
    });
  });

  describe('listByType', () => {
    it('Contents', async function () {
      nock('https://packagist.org')
        .get('/packages/list.json?type=composer-plugin')
        .replyWithFile(200, __dirname + `/mocks/listByType.json`, {
          'Content-Type': 'application/json',
        });

      const result = await listByType('composer-plugin');
      expect(result).to.have.key('packageNames');
    });
  });
});
