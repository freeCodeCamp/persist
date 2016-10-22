import studentValidation from '../models/validation/studentValidation';

export default function formatRecord(record) {

  const logObject = {
    osis: record.osis,
    firstName: record.firstName,
    lastName: record.lastName,
    dob: record.dob
  };

  if (!record.osis) {
    return;
  }


  // handle dates
  let dateFields = [];
  for (var key in studentValidation) {
    if (studentValidation[key] === Date || studentValidation[key].type === Date) {
      dateFields.push(key);
    }
  }

  dateFields.forEach(function(dateField) {

    let value = record[dateField];

    if (!value) {
      // console.error('no date, deleting....'.red, logObject);
      delete record[dateField];
    } else {
      value = value.split(/[-\/]/).join(' ');
      value = new Date(value);
      if (value.toString() === 'Invalid Date') {
        // console.log('invalid date, deleting...'.red, logObject);
        delete record[dateField];
      } else {
        // console.log('successfully transformed'.green, logObject);
        record[dateField] = value;
      }
    }
  });


  // handle things that should be arrays

  const shouldBeArrays = ['tags', 'studentSupportOrgName', 'transferStatus'];

  for (var key in record) {

    // sort out arrays 
    if (shouldBeArrays.includes(key)) {

      if (!record[key] || (typeof record[key] === 'string' && record[key].length < 1)) {
        record[key] = [];
      } else {
        record[key] = record[key].replace(/,\s+/g, ',');
        record[key] = record[key].split(/[;,]/);
      }
      continue;
    }


    // sort out empty strings
    if (!record[key] || (typeof record[key] === 'string' && record[key].length < 1)) {
      record[key] = undefined;
    }

  }



  // if (!record.tags || (typeof record.tags === 'string' && record.tags.length < 1)) {
  //     record.tags = []
  //   }
  //   else {
  //     record.tags = record.tags.split(',');
  //   }


  // handle empty strings - horrible....

  // for (var key in record) {
  //   if (!record[key] || (typeof record[key] === 'string' && record[key].length < 1)) {
  //     record[key] = null;
  //   }
  // }



  return record;

  // record.termStartDate = new Date(record.termStartDate);
  // record.termEndDate = new Date(record.termEndDate);

  // if (record.tags) {
  //  record.tags = record.tags.split(/\s+/);
  // }


  // if (!checkDate(record.lastModifiedDate) && !checkDate(record.termStartDate) && !checkDate(record.termEndDate)) {
  //  console.log(record);
  //  return;
  // }

  // console.log(record);
  // let terms = [];

  // for (let i = 1; i <= 8; i++) {
  //   terms[i - 1] = {};
  //   terms[i - 1].name = record['Term' + i];
  //   terms[i - 1].status = record['Status' + i];
  //   terms[i - 1].college = record['College' + i];
  //   terms[i - 1].recordType = record['Record Type' + i];
  // }


  // record.terms = terms;

  // record.terms = [];

  // for (var i = 0; i < 8; i++) {
  //  record.terms.push({});
  // }

}