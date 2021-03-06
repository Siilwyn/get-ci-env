# get-ci-env
[![Travis Build Status][travis-badge]][travis]
[![LGTM Grade][lgtm-badge]][lgtm]
[![npm][npm-badge]][npm]

Get and normalize the environment variables from continuous integration services. This package is similar to [pvdlg's env-ci](https://github.com/pvdlg/env-ci) but goes for a simpler approach. This results in a more restricted and lightweight (zero dependencies) package:
- Only CI services that contain all expected values in the environment are supported, taking away the need to manually check the returned data.
- Return a promise to indicate if a valid CI environment is detected for explicit error handling.
- Logically nested data for concise naming and easy detection of pull request context: `if (ciEnvOutput.pr) { ... }`.

## Install
`npm install get-ci-env`

## Usage
Example usage when running inside Buildkite:
```js
import getCiEnv from 'get-ci-env';

getCiEnv().then(console.log);
```
Resulting in the output:
```js
{
  service: 'buildkite',
  branch: 'add-long-eared',
  commit: '1ef3f7c',
  repo: { owner: 'Selwyn', name: 'hedgehogs' },
  pr: { number: '3', branch: 'master' },
}
```

## Supported services
- [AppVeyor](https://appveyor.com/)
- [Buildkite](https://buildkite.com/)
- [Codefresh](https://codefresh.io/)
- [GitLab CI](https://about.gitlab.com/product/continuous-integration/)
- [Travis CI](https://travis-ci.com/)

## Variables
- **service**: Camel-cased CI service name
- **branch**: Name of the the branch being built
- **commit**: Commit SHA hash that triggered the CI build
- **repo**:
  - **owner**: Name of the repository owner
  - **name**: Repository name
- **pr**: *Only set when triggered by a pull request*
  - **number**: Pull request number
  - **targetBranch**: Name of the base branch that the pull request is targeting

## API
### getCiEnv(env)

#### env
Type: `object`  
Default: `process.env`  
The user environment.

[travis]: https://travis-ci.com/Siilwyn/get-ci-env
[travis-badge]: https://api.travis-ci.com/Siilwyn/get-ci-env.svg
[lgtm]: https://lgtm.com/projects/g/Siilwyn/get-ci-env/
[lgtm-badge]: https://tinyshields.dev/lgtm/grade/javascript/g/Siilwyn/get-ci-env.svg
[npm]: https://www.npmjs.com/package/get-ci-env
[npm-badge]: https://tinyshields.dev/npm/get-ci-env.svg
