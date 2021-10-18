import { prop } from '@typegoose/typegoose';

export enum GameState {
  CREATED,
  JOINING,
  PLAYING,
  FINISHED,
  ABANDONED,
}

export class Room {
  @prop({ required: true, unique: true })
  public id!: string;

  @prop({ required: true })
  public gameName!: string;

  @prop({ required: true })
  public roomCode!: string;

  @prop({ required: true, type: String, default: [] })
  public players?: string[];

  @prop({ required: true })
  public state!: GameState;

  @prop({ required: true })
  public createdAt!: Date;

  @prop({ required: true })
  public updatedAt!: Date;
}
