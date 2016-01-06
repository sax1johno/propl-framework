var app = require('./build/app');

app.listen(process.env.PORT);
console.log("Listening to app on IP ", process.env.IP, ' on port ', process.env.PORT);