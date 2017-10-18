describe('Server Routes', () => {
    describe('upload routes', () => {
        require('./upload/studentData');
        require('./upload/applicationData');
        require('./upload/collegeData');
        require('./upload/schoolData');
        require('./upload/termData');
    });

    describe('REST API', () => {
        require('./api/student');
        require('./api/college');
        require('./api/students');
        require('./api/users');
        require('./api/colleges');
        require('./api/schools');
    });
});
