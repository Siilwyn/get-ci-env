'use strict';

module.exports = (env = process.env) =>
  getCiService(env).then(service => normalizeCiEnv(env, service));

const envMapping = env => ({
  branch: {
    circleCi: env.CIRCLE_BRANCH,
    travis: env.TRAVIS_PULL_REQUEST_SHA || env.TRAVIS_COMMIT,
  },
  commit: {
    circleCi: env.CIRCLE_SHA1,
    travis: env.TRAVIS_PULL_REQUEST_SHA || env.TRAVIS_COMMIT,
  },
  repoOwner: {
    circleCi: env.CIRCLE_PROJECT_USERNAME,
    travis: env.TRAVIS_REPO_SLUG && env.TRAVIS_REPO_SLUG.split('/')[0],
  },
  repoName: {
    circleCi: env.CIRCLE_PROJECT_REPONAME,
    travis: env.TRAVIS_REPO_SLUG && env.TRAVIS_REPO_SLUG.split('/')[1],
  },
  prNumber: {
    circleCi: env.CIRCLE_PR_NUMBER,
    travis: env.TRAVIS_PULL_REQUEST,
  },
});

function getCiService(env) {
  return Object.entries({
    travis: env.TRAVIS,
    circleCi: env.CIRCLECI,
  }).reduce((matches, [service, match]) => {
    if (match) return Promise.resolve(service);
    return Promise.reject('No matching CI service environment.');
  });
}

function normalizeCiEnv(env, service) {
  const variableMapping = envMapping(env);

  return {
    service,
    branch: variableMapping.branch[service],
    commit: variableMapping.commit[service],
    repo: {
      owner: variableMapping.repoOwner[service],
      name: variableMapping.repoName[service],
    },
    ...getPrInfo(env, service, variableMapping),
  };
}

function getPrInfo(env, service, variableMapping) {
  if (!isPr(env)) return;

  return {
    pr: {
      number: variableMapping.prNumber[service],
    },
  };
}

function isPr(env) {
  return [env.CIRCLE_PULL_REQUEST, env.TRAVIS_PULL_REQUEST].some(
    ciVariable => ciVariable && ciVariable !== 'false',
  );
}
