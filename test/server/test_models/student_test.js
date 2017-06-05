const expect = require('expect');
const sinon = require('sinon');
const path = require('path');
const {ObjectID} = require('mongodb');
const validator = require('../../../app/common/validator');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));

describe('student', () => {
  const {enums} = validator;

  it.skip('should only allow an ethnicity integer in range [1,7]', () => {});

  it.skip('should only allow gender from enums.gender', () => {});

  it.skip('should only allow postSecPlan from enums.postSecPlan', () => {});

  it.skip('should validate the descriptors field', () => {});

  it.skip('should validate the studentSupportOrgName field', () => {});

  it.skip('should validate the employmentStatus field', () => {});

  it.skip('should only allow progressToGradAss from enums.progressToGradAss', () => {});

  it.skip('should only allow progressToGradBa from enums.progressToGradBa', () => {});

  it.skip('should validate the remediationStatus field', () => {});

  it.skip('should validate the transferStatus field', () => {});

  it.skip('should only allow commonApp from enums.commonApp', () => {});

  it.skip('should only allow cunyApp from enums.cunyApp', () => {});

  it.skip('should only allow registeredForClasses from enums.registeredForClasses', () => {});

  it.skip('should only allow residency from enums.residency', () => {});

  it.skip('should only allow sunyApp from enums.sunyApp', () => {});

  it.skip('should only allow tshirtSize from enums.tshirtSize', () => {});

  it.skip('should only allow sweatshirtSize from enums.sweatshirtSize', () => {});

  it.skip('should only allow housingStatus from enums.housingStatus', () => {});

  it.skip('should only allow physImmunRecords from enums.physImmunRecords', () => {});
});
