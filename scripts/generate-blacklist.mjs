// =======================================================
// = generate-blacklist.mjs                              =
// =======================================================
// = Downloads a list of known throwaway e-mail domains  =
// = and generates a JavaScript file with an array of    =
// = strings.                                            =
// =======================================================
import fetch from 'node-fetch';
import * as htmlParser from 'node-html-parser';
import fs from 'fs';

const gistBaseUrl = 'https://gist.github.com';
const gistOwner = 'synthetic-borealis';
const gistId = '331aef3e90f5e657f17cbdb25151665d';
const domainListGist = `${gistBaseUrl}/${gistOwner}/${gistId}`;
const domainListSourceFile = 'disposable-email-provider-domains';
const outputFileName = './src/utils/domain-blacklist.js';

const getFile = (fileUrl) => {
  return fetch(fileUrl, {
    method: 'GET',
  }).then((res) =>
    res.ok
      ? res.body
      : Promise.reject({
          status: res.status,
          message: res.message,
          url: fileUrl,
        })
  );
};

const getTextFromStream = (readStream, streamUrl = '') =>
  new Promise((resolve, reject) => {
    let readBuffer = '';

    readStream.on('data', (chunk) => (readBuffer += chunk));
    readStream.on('end', () => resolve(readBuffer));
    readStream.on('error', (error) =>
      reject({
        status: -1,
        message: `Could not read from stream`,
        url: streamUrl,
      })
    );
  });

const getHTMLRoot = (sourceData, streamUrl = '') =>
  new Promise((resolve, reject) => {
    const htmlRoot = htmlParser.parse(sourceData);

    if (!htmlRoot) {
      reject({
        status: -1,
        message: 'Could not parse HTML',
        url: streamUrl,
      });
    } else {
      return resolve(htmlRoot);
    }
  });

const findElementBySelector = (htmlRoot, selector, streamUrl) =>
  new Promise((resolve, reject) => {
    const element = htmlRoot.querySelector(selector);

    if (!element) {
      reject({
        status: -1,
        message: `No element with selector ${selector}`,
        url: streamUrl,
      });
    } else {
      resolve(element);
    }
  });

const findAttributeInElement = (element, attributeName, streamUrl) =>
  new Promise((resolve, reject) => {
    const attribute = element.getAttribute(attributeName);

    if (!attribute) {
      reject({
        status: -1,
        message: `Attribute ${attributeName} not found`,
        url: streamUrl,
      });
    } else {
      resolve(attribute);
    }
  });

const rawList = await getFile(domainListGist)
  .then((readStream) => getTextFromStream(readStream, domainListGist))
  .then((res) => getHTMLRoot(res))
  .then((res) =>
    findElementBySelector(res, `#file-${domainListSourceFile}`, domainListGist)
  )
  .then((res) => findElementBySelector(res, '.btn', domainListGist))
  .then((res) => findAttributeInElement(res, 'href', domainListGist))
  .then((res) => {
    const listFileUrl = `${gistBaseUrl}${res}`;

    return getFile(listFileUrl)
      .then((readStream) => getTextFromStream(readStream, listFileUrl))
      .then((res) => res);
  })
  .catch((error) => {
    console.log(`Error:\n Status: ${error.status || 0}`);
  });

if (typeof rawList === 'string') {
  let domainBlacklist = rawList.split('\n');
  domainBlacklist = domainBlacklist.map((value) => `  '${value}'`);
  const output = `const domainBlacklist = [\n${domainBlacklist.join(',\n')},\n];\n\nmodule.exports = domainBlacklist;\n`;

  fs.writeFile(outputFileName, output, (err) => {
    if (err) {
      console.log(err);
    }
  });
}
