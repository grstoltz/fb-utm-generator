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

app.post('/upload', upload.any(), async (req, res) => {
  const strBuffer = await req.files[0].buffer.toString('utf8');
  // console.log(strBuffer);
  const parseCSV = () => {
    let csvData = [];
    csv
      .fromString(strBuffer, {
        headers: true,
        delimiter: '\t'
      })
      .on('data', data => {
        console.log(data);

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
  parseCSV(strBuffer);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
