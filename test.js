import saveGraduationData from './app/server/utils/save_csv_graduation_data';

saveGraduationData('./collegeGraduationRecords.csv').then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});