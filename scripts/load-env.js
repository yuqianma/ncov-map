try {
  const env = require('../env.config.local.js');
  Object.assign(process.env, env);
} catch (e) {
  // console.log('no env file');
}
