const express = require('express');
const app = express();
const controller = require('./controllers/flickrController');


var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.get('/', controller.getData);


app.listen(port, () => {
	console.log(`app is listening to port ${port}`);
});