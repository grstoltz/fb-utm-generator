const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const csv = require('fast-csv');
const multer = require('multer');
const cors = require('cors');

const storage = multer.memoryStorage();

const upload = multer({ storage });

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());

// Serve up static assets
app.use(express.static('client/build'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.post('/upload', upload.any(), (req, res) => {
  const buffer = req.files[0].buffer.toString('utf8');
  const parseCSV = async fileName => {
    const csvData = [];
    csv
      .fromString(buffer, { headers: true })
      .on('data', data => {
        csvData.push(data);
      })
      .on('end', () => {
        processArr(csvData);
      });
  };

  const processArr = async arr => {
    await arr.forEach(element => {
      const {
        'Campaign Name': campaignName,
        'Ad Set Name': adSetName,
        'Ad Name': adName
      } = element;
      const utmString = `utm_source=${req.body.source}&utm_medium=${
        req.body.medium
      }&utm_campaign=${encodeURI(campaignName)}&utm_term=${encodeURI(
        adSetName
      )}&utm_content=${encodeURI(adName)}`;
      element['URL Tags'] = utmString;
    });
    jsontoCSV(arr);
  };

  const jsontoCSV = arr => {
    const fileName = req.files[0].originalname
      .split('/')
      .pop()
      .replace(/(\.[\w\d_-]+)$/i, '_parsed.csv');
    csv.writeToString(arr, { headers: true }, function(err, data) {
      if (err) {
        res.send(err);
      } else {
        res.writeHead(200, {
          'Content-Disposition': `attachment; filename=${fileName}`,
          'Content-Type': 'text/csv'
        });
        res.write(data);
        res.end();
      }
    });
  };
  parseCSV(buffer);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
