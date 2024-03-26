const puppeteer = require("puppeteer");
const {DisposableMail} = require("disposable-mail-api");
const {faker} = require("@faker-js/faker");

class Puppet {
  constructor() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.firstName();
    const username = faker.internet.userName({firstName, lastName});
    const password = faker.internet.password({length: 10});

    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
  }

  makeEmailAddress() {
    const {username, password} = this;
    
    this.mail = new DisposableMail();
    this.emailAddress = this.mail.generate({username, password});
  }
};

class KeyGenerator {
  constructor() {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ],
      process.env.CHROMIUM_EXECUTABLE_PATH
    });
  }
}

module.exports = {Puppet, KeyGenerator};