trending = require('trending-github');

trending('monthly').then(repos => console.log(repos));
