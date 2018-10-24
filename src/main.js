'use strict';

module.exports = (env = process.env) =>
  getCiService(env).then(service => normalizeCiEnv(envMapping(env), service));

const envMapping = env => ({
  detection: {
    circleCi: 'CIRCLECI',
    travis: 'TRAVIS',
  },
  branch: {
    circleCi: env.CIRCLE_BRANCH,
    travis: env.TRAVIS_PULL_REQUEST_BRANCH || env.TRAVIS_BRANCH,
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
  isPr: {
    circleCi: env.CIRCLE_PULL_REQUEST,
    travis: env.TRAVIS_PULL_REQUEST,
  },
  prNumber: {
    circleCi:
      env.CIRCLE_PULL_REQUEST && env.CIRCLE_PULL_REQUEST.split('/').pop(),
    travis: env.TRAVIS_PULL_REQUEST,
  },
});

function getCiService(env) {
  const service = Object.entries(envMapping(env).detection).find(
    ([service, match]) => env[match],
  );

  return service
    ? Promise.resolve(service[0])
    : Promise.reject(
        `No supported CI service found, none of the following environment value is set: ${Object.values(
          envMapping(env).detection,
        ).join(', ')}.`,
      );
}

function normalizeCiEnv(ciEnvMapping, service) {
  return {
    service,
    branch: ciEnvMapping.branch[service],
    commit: ciEnvMapping.commit[service],
    repo: {
      owner: ciEnvMapping.repoOwner[service],
      name: ciEnvMapping.repoName[service],
    },
    ...getPrInfo(ciEnvMapping, service),
  };
}

function getPrInfo(ciEnvMapping, service) {
  if (!isTruthyCiVariable(ciEnvMapping.isPr[service])) return;

  return {
    pr: {
      number: ciEnvMapping.prNumber[service],
    },
  };
}

function isTruthyCiVariable(ciVariable) {
  return ciVariable && ciVariable !== 'false';
}
