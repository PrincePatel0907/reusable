// const mongoose = require("mongoose");
import { prop, getModelForClass, DocumentType, Ref, } from '@typegoose/typegoose';

export class Connection {
    @prop({ required: true})
    public refreshToken!: string;

    @prop({ required: true, unique: true })
    public accessToken!: string;
    
    @prop({ required: true, unique: true })
    public merchantId!: string;

    @prop({ type: String, required: true })
    public accessTokenExpiryDate?: string;

    @prop({ type: String, required: true })
    public quickbookCompanyId?: string;

    @prop({ type: String, required: true })
    public quickbookCompanyName?: string;

    @prop({ type: String, required: true })
    public refreshTokenExpiryDate?: string;

    public createdAt!: Date;
    public updatedAt!: Date;
}

export default getModelForClass(Connection, { schemaOptions: { timestamps: true } });

