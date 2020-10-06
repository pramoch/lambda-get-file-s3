const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const XLSX = require('xlsx');

exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name;
  const Key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  // const Bucket = 'pramoch';
  // const Key = 'data.xlsx';

  console.log('Bucket: ' + Bucket);
  console.log('Key: ' + Key);

  try {
      const params = {
          Bucket,
          Key
      };
      const data = await s3.getObject(params).promise();

      // const workbook = XLSX.readFile('data.xlsx');
      const workbook = XLSX.read(data.Body);

      const result = {};
      workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
        if(roa.length) result[sheetName] = roa;
      });

      console.log(JSON.stringify(result, 2, 2));
  }
  catch (error) {
      console.log(error);
      return;
  }
}

// exports.handler();