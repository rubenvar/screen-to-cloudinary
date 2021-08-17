# Screen to Cloudinary

🚧 Work In Progress 🚧

## What is this?

A Lambda function.

It takes a screenshot of a given URL, posts the image to a Cloudinary account, and returns the URL of the hosted image.

Original idea comes from the [gatsby-transformer-screenshot](https://www.gatsbyjs.com/plugins/gatsby-transformer-screenshot/) plugin for Gatsby.

## Features

🚧 TODO

## How to test it

3 tests can be done:

- Run locally and save to `./screenshots`. Tests the pupeteer process is working.
- Run locally and save to Cloudinary. Tests saving to Cloudinary works.
- Run remotelly (in AWS) and save to Cloudinary. Tests that the deploy to AWS and the API Gateway config works.

### Local Test

Takes a screenshot with pupeteer and can save it either to Cloudinary or to filesystem.

- `npm install` first.
  - `puppeteer` needs to be installed as devDep for the function to work locally.

It can save screenshot to local fs, or to Cloudinary. Edit `.env` file to choose:

- Set `SITE_URL` with the url to take screenshot of.
- If `CLOUDINARY_URL` is set, it **saves to Cloudinary**.
- Remove it and set `TEST_WITH_LOCAL_FS` to `true` to **save screenshot to local**. Screenshots will be saved to `./screenshots`.
- Edit `__manual-tests__/config.js` with details about screenshot.
- Execute:

```bash
node __manual-tests__/local-test.js
```

### Remote Test

Need to deploy it first. After, tests it making a POST request to the AWS endpoint and it saves to Cloudinary.

Deploy fn to Lambda:

- Run `npm run build-lambda-package`.
- Upload the .zip into Lambda function (through S3, it's too big as it must include the whole `node_modules` folder 🤷‍♂️).
- Setup all the API Gateway, etc.
- Set CLOUDINARY_URL env variable **in Lambda**.

Test the function deployed at `<URL to Lambda endpoint>`:

- Set LAMBDA_ENDPOINT ad SITE_URL env variables **locally**.
- Execute:

```bash
node __manual-tests__/remote-test.js
```

## Future

- [ ] Manage all test settings from the `__manual-tests__/config.js` file.
- [x] Pass some config for the size of image returned
