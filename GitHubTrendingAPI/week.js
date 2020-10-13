trending = require('trending-github');

trending('weekly').then(repos => console.log(repos));