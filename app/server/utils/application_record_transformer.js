import College from '../models/college';

export default (record, callback) => {
    if (!record.osis) {
        callback(null, null);
        return;
    }

    //  reference college
    College.findOne(
        {
            $or: [
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
            callback(null, null);
        }
    );
};
