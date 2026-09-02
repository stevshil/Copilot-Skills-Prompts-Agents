const { createApp } = require('./app');

const { app } = createApp();
const port = Number.parseInt(process.env.PORT || '3000', 10);

app.listen(port, () => {
  console.log(`Todo API listening on port ${port}`);
});
