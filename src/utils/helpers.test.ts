// import { constants } from './constants';
// import { getNewHref } from './helpers';

//use require

const { getNewHref } = require('./helpers');
const { constants } = require('./constants');

const PREPEND_URL = constants.MENLO_URL;

// TODO(vince): sort out.. how can I use parameterized test?
// maybe ts-jest?

// XXX: how to test with browser?

test('Exclude test - domain', () => {
  const excludeType = 'domain';
  const excludePatterns = ['google.com', 'kakaocorp.com'];
  const isCurrentPageExcluded = false;

  const href = 'https://google.com';
  const newHref = getNewHref(href, excludeType, excludePatterns, isCurrentPageExcluded);
  expect(newHref).toBe(href);
});

test('Prepend test - domain', () => {
  const excludeType = 'domain';
  const excludePatterns = ['google.com', 'kakaocorp.com'];
  const isCurrentPageExcluded = false;

  const href = 'https://example.com';
  const newHref = getNewHref(href, excludeType, excludePatterns, isCurrentPageExcluded);
  expect(newHref).toBe(`${PREPEND_URL}/${href}`);
});

test('href starts with slash (isCurrentPageExcluded: true)', () => {
  const excludeType = 'domain';
  const excludePatterns = ['google.com', 'kakaocorp.com'];
  const isCurrentPageExcluded = true;

  const href = '/test';
  const newHref = getNewHref(href, excludeType, excludePatterns, isCurrentPageExcluded);
  expect(newHref).toBe(href);
});

test('href starts with slash (isCurrentPageExcluded: false)', () => {
  const excludeType = 'domain';
  const excludePatterns = ['google.com', 'kakaocorp.com'];
  const isCurrentPageExcluded = false;

  const href = '/test';
  const newHref = getNewHref(href, excludeType, excludePatterns, isCurrentPageExcluded);
  expect(newHref).toBe(`${PREPEND_URL}${href}`);
});

test('link with only slash (isCurrentPageExcluded: true)', () => {
  const excludeType = 'domain';
  const excludePatterns = ['google.com', 'kakaocorp.com'];
  const isCurrentPageExcluded = true;

  const href = '/';
  const newHref = getNewHref(href, excludeType, excludePatterns, isCurrentPageExcluded);
  expect(newHref).toBe(href);
});

test('link with only slash (isCurrentPageExcluded: false)', () => {
  const excludeType = 'domain';
  const excludePatterns = ['google.com', 'kakaocorp.com'];
  const isCurrentPageExcluded = false;

  const href = '/';
  const newHref = getNewHref(href, excludeType, excludePatterns, isCurrentPageExcluded);
  expect(newHref).toBe(`${PREPEND_URL}${href}`);
});
