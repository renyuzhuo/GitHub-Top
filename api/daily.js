trending = require('trending-github');

trending('daily').then(repos => {
  console.log(JSON.stringify(repos));
});