const webapp = require('./server');

const port = 8080;

webapp.listen(port, async () => {
  console.log(`Server running on port: ${port}`);
});
