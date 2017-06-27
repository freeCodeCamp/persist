import College from '../models/college';

export default (record, callback) => {
    if (!record.osis) {
        callback(null);
        return;
    }
    if (!record.college) {
        return callback(null);
    }
    //  reference college
    College.findOne(
        {
            $or: [
                { opeid: record.opeid },
                { fullName: record.college },
                { shortName: record.college },
                { navianceName: record.college },
                { collegeScorecardName: record.college }
            ]
        },
        (err, college) => {
            if (err) {
                console.log('college not found', err);
                callback(err);
                return;
            }
            if (college) {
                record.college = college._id;
                callback(null, record);
                return;
            }
            callback(null);
        }
    );
};
