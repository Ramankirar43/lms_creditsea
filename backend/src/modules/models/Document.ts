import mongoose, { Document as MongoDocument, Schema, Types } from 'mongoose';

export interface IDocument extends MongoDocument {
  borrowerId: Types.ObjectId;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: Date;
}

const documentSchema = new Schema<IDocument>({
  borrowerId: { type: Schema.Types.ObjectId, ref: 'BorrowerProfile', required: true },
  originalName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export const DocumentModel = mongoose.model<IDocument>('Document', documentSchema);
