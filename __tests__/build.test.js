const { exec } = require('child_process');

describe('Jekyll Build', () => {
  jest.setTimeout(30000); // Increase timeout to 30 seconds

  test('site builds without errors', (done) => {
    exec('bundle exec jekyll build --trace', (error, stdout, stderr) => {
      if (error) {
        console.error('Build Error:', error);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
      }
      expect(stdout).toContain('done');
      done();
    });
  });
});
