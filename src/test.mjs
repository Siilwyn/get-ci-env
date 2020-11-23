import test from 'tape';
import getCiEnv from './main.mjs';

test('handles different contexts', (t) => {
  t.plan(3);
  getCiEnv({ BUILDKITE: 'true' }).then(t.ok);
  getCiEnv({ TRAVIS: 'true' }).then(t.ok);
  getCiEnv({}).catch(t.ok);
});

test('returns CI environment variables', (t) => {
  t.plan(3);

  const baseContext = {
    BUILDKITE: 'true',
    BUILDKITE_BRANCH: 'master',
    BUILDKITE_COMMIT: 'abc',
    BUILDKITE_ORGANIZATION_SLUG: 'Selwyn',
    BUILDKITE_PIPELINE_SLUG: 'hedgehogs',
    BUILDKITE_PULL_REQUEST: 'false',
  };

  const expectedBaseResult = {
    service: 'buildkite',
    branch: 'master',
    commit: 'abc',
    repo: { owner: 'Selwyn', name: 'hedgehogs' },
  };

  getCiEnv(baseContext, 'buildkite').then((result) => {
    t.deepEqual(result, expectedBaseResult, 'normal context');
    t.is(result.pr, undefined, 'no pull request context');
  });

  getCiEnv(
    {
      ...baseContext,
      CIRCLE_PULL_REQUEST: 'https://github.com/Siilwyn/nowlify/pull/7',
      CIRCLE_BRANCH: 'master',
    },
    'circleCi',
  ).then((result) =>
    t.deepEqual(
      result,
      {
        ...expectedBaseResult,
        pr: { number: '7' },
      },
      'pull request context',
    ),
  );
});
