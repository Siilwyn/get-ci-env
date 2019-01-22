# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and follows [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2019-01-22
### Added
- Buildkite support.
- ESM export output, so both `require('get-ci-env')` and `import getCiEnv from 'get-ci-env'` work!

## [1.2.0] - 2019-01-02
### Added
- GitLab CI support.

## [1.1.0] - 2018-10-24
### Added
- CI detection names to error message when missing a supported CI environment.
- Codefresh support.

## [1.0.3] - 2018-10-01
### Fixed
- Travis CI branch name retrieval.

## [1.0.2] - 2018-04-17
### Fixed
- Detection of Travis CI environment.

## [1.0.1] - 2018-04-09
### Fixed
- CircleCI pull request number retrieval.

[1.3.0]: https://github.com/Siilwyn/get-ci-env/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/Siilwyn/get-ci-env/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/Siilwyn/get-ci-env/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/Siilwyn/get-ci-env/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/Siilwyn/get-ci-env/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Siilwyn/get-ci-env/compare/v1.0.0...v1.0.1
