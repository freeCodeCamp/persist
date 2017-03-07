import UploadHistory from "../models/uploadHistory";

export const createHistory = (type, user, success) => {
    UploadHistory.create({
        type,
        user,
        when: new Date(),
        success
    }, (err) => {
        if (err) {
            return console.log(err);
        }
    })
};

export const getHistory = (req, res) => {
    const page = req.params.page || 1;
    UploadHistory.paginate({}, { sort: { when: -1 }, page, limit: 10 })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
};

export default {
    createHistory,
    getHistory
}
