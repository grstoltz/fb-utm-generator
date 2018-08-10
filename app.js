const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const csv = require('fast-csv');
const multer = require('multer');
const cors = require('cors');
const utf8 = require('utf8');

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

app.post('/upload', upload.any(), async (req, res) => {
  console.log(req.files[0]);
  const strBuffer = await req.files[0].buffer.toString('utf-8');

  const sanitizeInput = string => {
    let csvData = [];
    csv
      .fromString(string, {
        headers: true,
        delimiter: '\t'
        //prettier-ignore
      })
      .on('data', data => {
        csvData.push(data);
      })
      .on('data-invalid', () => {
        console.log('error');
      })
      .on('error', err => {
        console.log(err);
      })
      .on('end', () => {
        jsontoCSV(csvData);
      });
  };

  const parseCSV = str => {
    let csvData = [];
    csv
      .fromString(str, {
        headers: true
      })
      .on('data', data => {
        csvData.push(data);
      })
      .on('data-invalid', () => {
        console.log('error');
      })
      .on('error', err => {
        console.log(err);
      })
      .on('end', () => {
        processArr(csvData);
      });
  };

  const sendCSV = arr => {
    csv.writeToString(arr, { headers: true }, function(err, data) {
      if (err) {
        res.send(err);
      } else {
        res.writeHead(200, {
          'Content-Disposition': `attachment; filename=parsed.csv`,
          'Content-Type': 'text/csv'
        });
        res.write(data);
        res.end();
      }
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
    sendCSV(arr);
  };

  const jsontoCSV = arr => {
    csv.writeToString(arr, { headers: true }, function(err, data) {
      parseCSV(data);
    });
  };
  sanitizeInput(strBuffer);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
