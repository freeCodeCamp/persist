import Student from './app/server/models/student';

Student.findOne({osis: 274724103}, (err, student) => {
    student.applications.push({ null: '',
        osis: 274724103,
        college: '58736fbf42e02c150e54fc94',
        type: 'EA',
        result: 'Accepted',
        defer: 'DF',
        attending: '',
        heop: '' })
    student.save
});