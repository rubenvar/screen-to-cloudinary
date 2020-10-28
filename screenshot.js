const fs = require(`fs`);
const fsPromises = require(`fs`).promises;
const path = require(`path`);
const md5 = require('md5');

class Screenshot {
  constructor(opts) {
    this.key = `${md5(opts)}.png`;
    this.width = opts.width;
    this.height = opts.height;
    this.url = opts.url;
    this.fullPage = opts.fullPage;
  }

  async getFile() {}

  async putFile() {}
}

/**
 * put / get a screenshot to the local filesystem
 */
class FSScreenshot extends Screenshot {
  constructor(opts) {
    super(opts);
    const dir = path.join(__dirname, `screenshots`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    this.fileUrl = path.join(dir, this.key);
  }

  async getFile() {
    // check if file exists
    try {
      let expires;
      await fsPromises.access(this.fileUrl);
      return { url: this.fileUrl, expires };
    } catch (error) {
      return false;
    }
  }

  async putFile(fileBuffer) {
    try {
      await fsPromises.writeFile(this.fileUrl, fileBuffer);
      this.expires = undefined;
      return { url: this.fileUrl, expires: this.expires };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = opts => {
  if (process.env.TEST_WITH_LOCAL_FS) {
    return new FSScreenshot(opts);
  }

  throw new Error(
    `A required environment variable is missing. Set S3_BUCKET or TEST_WITH_LOCAL_FS and try again.`
  );
};
