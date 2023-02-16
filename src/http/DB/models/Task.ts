/* eslint-disable new-cap */
import {Column, DataType, Model, Table} from "sequelize-typescript";


@Table
export class Task extends Model<Task, ITaskAttributes> {
   @Column({type: DataType.STRING, allowNull: false})
   declare name: string;

   @Column({type: DataType.STRING, allowNull: true})
   declare description: string;

   @Column({type: DataType.INTEGER, allowNull: true})
   declare taskPoints: number;

   @Column({type: DataType.BOOLEAN, defaultValue: false})
   declare completed: boolean;

   @Column({
      type: DataType.INTEGER,
      allowNull: false,
   })
   declare activityId: number;
}


export interface ITaskAttributes {
   name: string,
   description: string | null,
   taskPoints: number,
   activityId: number,
}
