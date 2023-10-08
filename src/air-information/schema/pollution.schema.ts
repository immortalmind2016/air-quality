import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PollutionDocument = HydratedDocument<Pollution>;

// We can make it as a geo point but to avoid complexity for this simple task let's keep it as it.
@Schema({ _id: false })
class GeoInfo {
  @Prop()
  lat: number;

  @Prop()
  lon: number;
}

@Schema({
  timestamps: true,
})
export class Pollution {
  @Prop()
  'ts': Date;

  @Prop({ index: true, type: Number })
  aqius: number; //main pollutant for US AQI

  @Prop({ type: String })
  mainus: string;

  @Prop({ type: Number })
  aqicn: number; //main pollutant for Chinese AQI

  @Prop({ type: String })
  maincn: string;

  @Prop({ type: GeoInfo })
  geoInfo: GeoInfo;

  createdAt: Date;

  updatedAt: Date;
}

export const PollutionSchema = SchemaFactory.createForClass(Pollution);
