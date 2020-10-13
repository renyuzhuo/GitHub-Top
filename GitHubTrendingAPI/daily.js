trending = require('trending-github');

trending('daily').then(repos => console.log(repos));