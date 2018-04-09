'use strict';

const assert = require('assert');
const test = require('tape');
const getCiEnv = require('./main.js');

test('handles different contexts', t => {
  t.plan(2);
  getCiEnv({ CIRCLECI: 'true' }).then(t.ok);
  getCiEnv({}).catch(t.ok);
});

test('returns CI environment variables', t => {
  t.plan(2);

  const baseContext = {
    CIRCLECI: 'true',
    CIRCLE_BRANCH: 'master',
    CIRCLE_SHA1: 'abc',
    CIRCLE_PROJECT_USERNAME: 'Selwyn',
    CIRCLE_PROJECT_REPONAME: 'hedgehogs',
    CIRCLE_PULL_REQUEST: 'false',
  };

  const baseResult = {
    service: 'circleCi',
    branch: 'master',
    commit: 'abc',
    repo: { owner: 'Selwyn', name: 'hedgehogs' },
  };

  getCiEnv(baseContext, 'circleCi').then(result =>
    t.deepEqual(result, baseResult, 'normal context'),
  );

  getCiEnv(
    {
      ...baseContext,
      CIRCLE_PULL_REQUEST: 'https://github.com/Siilwyn/nowlify/pull/7',
      CIRCLE_BRANCH: 'master',
    },
    'circleCi',
  ).then(result =>
    t.deepEqual(
      result,
      {
        ...baseResult,
        pr: { number: 7 },
      },
      'pull request context',
    ),
  );
});
