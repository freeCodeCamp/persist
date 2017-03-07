import { uploadHistorySchema } from '../../common/schemas';
import mongoosePaginate from 'mongoose-paginate';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const UploadHistory = new Schema(uploadHistorySchema(Schema));
UploadHistory.plugin(mongoosePaginate);
export default mongoose.model('UploadHistory', UploadHistory);
