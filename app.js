const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const d3 = require('d3-dsv');

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
  const strBuffer = req.files[0].buffer.toString('utf-16le');

  const parsedTSV = await d3.tsvParse(strBuffer);

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
    sendTSV(arr);
  };

  const sendTSV = async arr => {
    const data = await d3.tsvFormat(arr);
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename=parsed.csv`,
      'Content-Type': 'text/csv'
    });
    res.write(data);
    res.end();
  };
  processArr(parsedTSV);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
