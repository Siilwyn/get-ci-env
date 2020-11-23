export default (env = process.env) =>
  getCiService(env).then((service) => normalizeCiEnv(envMapping(env), service));

const envMapping = (env) => ({
  detection: {
    buildkite: 'BUILDKITE',
    codefresh: 'CF_BUILD_ID',
    gitlabCi: 'GITLAB_CI',
    travis: 'TRAVIS',
  },
  branch: {
    buildkite: env.BUILDKITE_BRANCH,
    codefresh: env.CF_BRANCH,
    gitlabCi: env.CI_COMMIT_REF_NAME,
    travis: env.TRAVIS_PULL_REQUEST_BRANCH || env.TRAVIS_BRANCH,
  },
  commit: {
    buildkite: env.BUILDKITE_COMMIT,
    codefresh: env.CF_REVISION,
    gitlabCi: env.CI_COMMIT_SHA,
    travis: env.TRAVIS_PULL_REQUEST_SHA || env.TRAVIS_COMMIT,
  },
  repoOwner: {
    buildkite: env.BUILDKITE_ORGANIZATION_SLUG,
    codefresh: env.CF_REPO_OWNER,
    gitlabCi: env.CI_PROJECT_PATH,
    travis: env.TRAVIS_REPO_SLUG && env.TRAVIS_REPO_SLUG.split('/')[0],
  },
  repoName: {
    buildkite: env.BUILDKITE_PIPELINE_SLUG,
    codefresh: env.CF_REPO_NAME,
    gitlabCi: env.CI_PROJECT_NAME,
    travis: env.TRAVIS_REPO_SLUG && env.TRAVIS_REPO_SLUG.split('/')[1],
  },
  isPr: {
    buildkite: env.BUILDKITE_PULL_REQUEST,
    codefresh: env.CF_PULL_REQUEST_NUMBER,
    gitlabCi: env.CI_MERGE_REQUEST_IID,
    travis: env.TRAVIS_PULL_REQUEST,
  },
  pr: {
    number: {
      buildkite: env.BUILDKITE_PULL_REQUEST,
      codefresh: env.CF_PULL_REQUEST_NUMBER,
      gitlabCi: env.CI_MERGE_REQUEST_IID,
      travis: env.TRAVIS_PULL_REQUEST,
    },
    targetBranch: {
      buildkite: env.BUILDKITE_PULL_REQUEST_BASE_BRANCH,
      codefresh: env.CF_PULL_REQUEST_TARGET,
      gitlabCi: env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME,
      travis: env.TRAVIS_BRANCH,
    },
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
      number: ciEnvMapping.pr.number[service],
      targetBranch: ciEnvMapping.pr.targetBranch[service],
    },
  };
}

function isTruthyCiVariable(ciVariable) {
  return ciVariable && ciVariable !== 'false';
}
