# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2021-08-18

### Removed

- Abstracted the UI into [it's own repo](https://github.com/rubenvar/screen-to-cloudinary-ui).

## [1.1.0] - 2021-08-18

### Added

- Created a basic UI with html, js and stylus. Added `parcel`.

## [1.0.0] - 2021-08-17

### Added

- Added "How to use" section in Readme.
- Added `cloudinary url` in config instead of environment variable. Removed the env variable, so the `cloudinary` package will break if no Cloudinary URL provided, as it needs either the env variable or a config object with `api_key`, `api_secret` and `cloud_name`.

## [0.1.2] - 2021-08-17

### Fixed

- Corrections in readme.

## [0.1.1] - 2021-08-17

### Added

- Added test docs in readme.
- Added ESLint and Prettier config.

### Changed

- Cleanup.
- Abstracted test config.
- Updated dependencies.

### Fixed

- Fixed various linting and styling errors.

## [0.1.0] - 2020-10-30

🎊 Initial release

### Added

- Lambda function logic to take a screenshot of a given URL and:
  - Save it to local FS (for testing).
  - Save it to a given Cloudinary account.
- If storing in local, it first checks for the same image in the folder (cached image). If it's found, doesn't take a new one.
