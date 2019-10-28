import express = require('express');
//import sampleRoute from './routes/sample.route.js';
import multer = require('multer');
import * as bodyParser from 'body-parser'
import serveStatic = require('serve-static');
import * as sampleController from './controllers/sample.controller'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/usr/src/app/uploads')
    },
    filename: function (req, file, cb) {
        console.log("File: ", file)
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop())
    }
})

const upload = multer({ storage });
// Set header to force download
/*const setHeaders = (res: express.Response, path: string) => {
    res.setHeader('Content-Disposition', contentDisposition(path))
  }
*/
const serveUpload = serveStatic('/usr/src/app/uploads', {
    'index': false,
    //'setHeaders': setHeaders
})
const serveExports = serveStatic('/usr/src/app/exports', {
    'index': false,
})
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/files/uploads/', serveUpload)
app.use('/api/v1/files/exports/', serveExports)

// ROUTES
app.get('/api/v1/samples', sampleController.getSamples);
app.get('/api/v1/samples/:id', sampleController.getSamples);
app.post('/api/v1/samples', upload.single('file'), sampleController.createSample);


app.listen(8000, () => console.log(`Example app listening on port 8000`))