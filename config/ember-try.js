'use strict';

const getChannelURL = require('ember-source-channel-url');

const isCI = !!process.env.CI;
const ciOptions = '--silent --reporter xunit > ./reports/test_results.xml';

function buildCommand(classic) {
  const base = classic ? 'ember test --filter classic' : 'ember test';
  return isCI ? `${base} ${ciOptions}` : base;
}

module.exports = async function() {
  return {
    command: buildCommand(false),
    useYarn: true,
    scenarios: [
      {
        name: 'ember-3.5',
        command: buildCommand(true),
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': true
          })
        },
        npm: {
          devDependencies: {
            'ember-native-class-polyfill': '^1.0.6',
            'ember-source': '~3.5.0',
            '@ember/jquery': '^0.5.1'
          }
        }
      },
      {
        name: 'ember-lts-3.12',
        command: 'ember test --filter classic',
        npm: {
          devDependencies: {
            'ember-source': '~3.12.0'
          }
        }
      },
      {
        name: 'ember-lts-3.16',
        npm: {
          devDependencies: {
            'ember-source': '~3.16.0'
          }
        }
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release')
          }
        }
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta')
          }
        }
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('canary')
          }
        }
      },
      // The default `.travis.yml` runs this scenario via `npm test`,
      // not via `ember try`. It's still included here so that running
      // `ember try:each` manually or from a customized CI config will run it
      // along with all the other scenarios.
      {
        name: 'ember-default',
        npm: {
          devDependencies: {}
        }
      },
      {
        name: 'ember-default-with-jquery',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': true
          })
        },
        npm: {
          devDependencies: {
            '@ember/jquery': '^0.5.1'
          }
        }
      },
      {
        name: 'ember-classic',
        command: buildCommand(true),
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'application-template-wrapper': true,
            'default-async-observers': false,
            'template-only-glimmer-components': false
          })
        },
        npm: {
          ember: {
            edition: 'classic'
          }
        }
      }
    ]
  };
};
