# get-ci-env
[![Travis Build Status][travis-icon]][travis]
[![npm][npm-icon]][npm]
[![David devDependencies Status][david-dev-icon]][david-dev]
[![LGTM Grade][lgtm-icon]][lgtm]

Get and normalize the environment variables from continuous integration services. This package is similar to [pvdlg's env-ci](https://github.com/pvdlg/env-ci) but goes for a simpler approach. This results in a more restricted and lightweight (zero dependencies) package:
- Only CI services that contain **all** values in the environment are supported, taking away the need to manually check the returned data.
- Return a promise to indicate if a valid CI environment is detected for explicit error handling.
- Logically nested data for concise naming and easy detection of pull request context: `if (ciEnvOutput.pr) { ... }`.

## Install
`npm install get-ci-env`

## Usage
Example usage when running inside CircleCI:
```js
import getCiEnv from 'get-ci-env';

getCiEnv().then(console.log);
```
Resulting in the output:
```js
{
  service: 'circleCi',
  branch: 'master',
  commit: 'abc',
  repo: { owner: 'Selwyn', name: 'hedgehogs' },
  pr: { number: '3' },
}
```

## Supported services
- [Buildkite](https://buildkite.com/)
- [CircleCI](https://circleci.com/)
- [Codefresh](https://codefresh.io/)
- [GitLab CI](https://about.gitlab.com/product/continuous-integration/)
- [Travis CI](https://travis-ci.com/)

## Variables
- **service**: Camel-cased CI service name
- **branch**: Branch name containing the relevant commit
- **commit**: Commit SHA hash that triggered the CI build
- **repo**:
  - **owner**: Name of the repository owner
  - **name**: Repository name
- **pr**: *Only set when triggered by a pull request*
  - **number**: Pull request number

## API
### getCiEnv(env)

#### env
Type: `object`  
Default: `process.env`  
The user environment.

[travis]: https://travis-ci.org/Siilwyn/get-ci-env
[travis-icon]: https://img.shields.io/travis/Siilwyn/get-ci-env/master.svg?style=flat-square
[david-dev]: https://david-dm.org/Siilwyn/get-ci-env?type=dev
[david-dev-icon]: https://img.shields.io/david/dev/Siilwyn/get-ci-env.svg?style=flat-square
[npm]: https://www.npmjs.com/package/get-ci-env
[npm-icon]: https://img.shields.io/npm/v/get-ci-env.svg?style=flat-square
[lgtm]: https://lgtm.com/projects/g/Siilwyn/get-ci-env/
[lgtm-icon]: https://img.shields.io/lgtm/grade/javascript/g/Siilwyn/get-ci-env.svg?style=flat-square
