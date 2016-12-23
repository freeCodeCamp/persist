import mongoose from 'mongoose';
import {notificationSchema} from '../../common/schemas';
const Schema = mongoose.Schema;
const Notification = new Schema(notificationSchema(Schema), {timestamps: true});
export default mongoose.model('Notification', Notification);
