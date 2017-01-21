const express = require('express');
const app     = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post(
    '*', function (req, res)
    {
        console.log(req.body);

        res.json(req.body);
    }
);

app.listen(
    3000, function ()
    {
        console.log('Example app listening on port 3000!');
    }
);