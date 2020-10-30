# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0]

🎊 Initial release

### Added

- Lambda function logic to take a screenshot of a given URL and:
  - Save it to local FS (for testing).
  - Save it to a given Cloudinary account.
- If storing in local, it first checks for the same image in the folder (cached image). If it's found, doesn't take a new one.
