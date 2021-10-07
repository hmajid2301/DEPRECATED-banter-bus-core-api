import { prop } from '@typegoose/typegoose';

enum GameState {
  Created = 'CREATED',
  Joining = 'JOINING',
  Playing = 'PLAYING',
  Finished = 'FINISHED',
  Abandoned = 'ABANDONED',
}

export class Room {
  @prop()
  public id!: string;

  @prop({ required: true })
  public gameName!: string;

  @prop({ required: false })
  public players!: string[];

  @prop({ required: true })
  public state!: GameState;

  @prop({ required: true, unique: true })
  public createdAt!: Date;
}
