const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const utils = require('./lib/utils');

const index = proxyquire('./index', {
  './notification-service': proxyquire('./notification-service', {
    'socket.io-client': () => {},
  }),
});

describe('index', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('initialize', () => {
    it('with object provides clients configured urls', () => {
      // Arrange
      const qsUrl = 'http://127.0.0.1:80';
      const smUrl = 'http://127.0.0.1:81';
      const fsUrl = 'http://127.0.0.1:82';
      const nsUrl = 'http://127.0.0.1:83';
      const sfUrl = 'http://127.0.0.1:84';
      const identityUrl = 'http://127.0.0.1:85';
      const account = 'testAccount';
      const userId = 'testUser';
      const password = 'testPassword';
      const allowSelfSignCert = true;

      // Act
      index.initialize({
        qsUrl,
        smUrl,
        fsUrl,
        nsUrl,
        sfUrl,
        identityUrl,
        account,
        userId,
        password,
        allowSelfSignCert,
      });

      // Assert
      const qsClient = index.getQueueServiceClient();
      const smClient = index.getStateMachineServiceClient();
      const fsClient = index.getFileServiceClient();
      const nsClient = index.getNotificationServiceClient();
      const sfClient = index.getServerlessFunctionsClient();
      const identityClient = index.getIdentityServiceClient();

      chai.expect(qsClient.serviceUrl).to.be.equal(qsUrl, 'Queue service url incorrectly configured.');
      chai.expect(smClient.serviceUrl).to.be.equal(smUrl, 'State machine service url incorrectly configured.');
      chai.expect(fsClient.serviceUrl).to.be.equal(fsUrl, 'File service url incorrectly configured.');
      chai.expect(nsClient.serviceUrl).to.be.equal(nsUrl, 'Notification service url incorrectly configured.');
      chai.expect(sfClient.serviceUrl).to.be.equal(sfUrl, 'Serverless functions service url incorrectly configured.');
      chai.expect(identityClient.serviceUrl).to.be.equal(identityUrl, 'Identity service url incorrectly configured.');
    });

    it('with string provides clients configured urls', () => {
      // Arrange
      const qsUrl = 'http://127.0.0.1:80';
      const smUrl = 'http://127.0.0.1:81';
      const fsUrl = 'http://127.0.0.1:82';
      const nsUrl = 'http://127.0.0.1:83';
      const sfUrl = 'http://127.0.0.1:84';
      const identityUrl = 'http://127.0.0.1:85';
      const account = 'testAccount';
      const userId = 'testUser';
      const password = 'testPassword';
      const allowSelfSignCert = true;

      sinon.stub(utils, 'getEnvConfig').withArgs('testEnv').returns({
        qsUrl,
        smUrl,
        fsUrl,
        nsUrl,
        sfUrl,
        identityUrl,
        account,
        userId,
        password,
        allowSelfSignCert,
      });

      // Act
      index.initialize('testEnv');

      // Assert
      const qsClient = index.getQueueServiceClient();
      const smClient = index.getStateMachineServiceClient();
      const fsClient = index.getFileServiceClient();
      const nsClient = index.getNotificationServiceClient();
      const sfClient = index.getServerlessFunctionsClient();
      const identityClient = index.getIdentityServiceClient();

      chai.expect(qsClient.serviceUrl).to.be.equal(qsUrl, 'Queue service url incorrectly configured.');
      chai.expect(smClient.serviceUrl).to.be.equal(smUrl, 'State machine service url incorrectly configured.');
      chai.expect(fsClient.serviceUrl).to.be.equal(fsUrl, 'File service url incorrectly configured.');
      chai.expect(nsClient.serviceUrl).to.be.equal(nsUrl, 'Notification service url incorrectly configured.');
      chai.expect(sfClient.serviceUrl).to.be.equal(sfUrl, 'Serverless functions service url incorrectly configured.');
      chai.expect(identityClient.serviceUrl).to.be.equal(identityUrl, 'Identity service url incorrectly configured.');
    });

    it('with undefined provides clients environment configured urls', () => {
      // Arrange
      const qsUrl = 'http://127.0.0.1:80';
      const smUrl = 'http://127.0.0.1:81';
      const fsUrl = 'http://127.0.0.1:82';
      const nsUrl = 'http://127.0.0.1:83';
      const sfUrl = 'http://127.0.0.1:84';
      const identityUrl = 'http://127.0.0.1:85';
      const account = 'testAccount';
      const userId = 'testUser';
      const password = 'testPassword';
      const allowSelfSignCert = true;

      sinon.stub(utils, 'getDefaultEnv').returns('defaultEnv');
      sinon.stub(utils, 'getEnvConfig').withArgs('defaultEnv').returns({
        qsUrl,
        smUrl,
        fsUrl,
        nsUrl,
        sfUrl,
        identityUrl,
        account,
        userId,
        password,
        allowSelfSignCert,
      });

      // Act
      index.initialize();

      // Assert
      const qsClient = index.getQueueServiceClient();
      const smClient = index.getStateMachineServiceClient();
      const fsClient = index.getFileServiceClient();
      const nsClient = index.getNotificationServiceClient();
      const sfClient = index.getServerlessFunctionsClient();
      const identityClient = index.getIdentityServiceClient();

      chai.expect(qsClient.serviceUrl).to.be.equal(qsUrl, 'Queue service url incorrectly configured.');
      chai.expect(smClient.serviceUrl).to.be.equal(smUrl, 'State machine service url incorrectly configured.');
      chai.expect(fsClient.serviceUrl).to.be.equal(fsUrl, 'File service url incorrectly configured.');
      chai.expect(nsClient.serviceUrl).to.be.equal(nsUrl, 'Notification service url incorrectly configured.');
      chai.expect(sfClient.serviceUrl).to.be.equal(sfUrl, 'Serverless functions service url incorrectly configured.');
      chai.expect(identityClient.serviceUrl).to.be.equal(identityUrl, 'Identity service url incorrectly configured.');
    });
  });

  it('throws error when initialized with invalid parameter type', () => {
    try {
      // Act
      index.initialize(1);
      throw new Error('Test passed when it should not have.');
    } catch (err) {
      chai.expect(err.message).to.be.equal('Initialization of MDS SDK failed. Type \'number\' not supported.');
    }
  });
});
