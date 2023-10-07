import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PollutionDocument = HydratedDocument<Pollution>;

@Schema({
  timestamps:true
})
export class Pollution {

  @Prop()
  "ts":Date

  @Prop({index:true}) 
  "aqius": Number  //main pollutant for US AQI

  @Prop()
  "mainus": String 

  @Prop()
  "aqicn": number //main pollutant for Chinese AQI

  @Prop()
  "maincn":String


}

export const PollutionSchema = SchemaFactory.createForClass(Pollution);