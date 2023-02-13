/* eslint-disable new-cap */
import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {Task} from "./Task";


@Table
export class Activity extends Model<Activity, IActivityAttributes> {
   @Column({type: DataType.STRING, allowNull: false})
   declare name: string;

   @Column({type: DataType.STRING, allowNull: true})
   declare description: string;

   @Column({
      type: DataType.INTEGER,
      allowNull: false,
   })
   declare hours: number;

   @Column({
      type: DataType.INTEGER,
      allowNull: false,
   })
   declare minutes: number;

   @Column({
      type: DataType.INTEGER,
      defaultValue: 0,
   })
   declare completedCount: number;

   @Column({
      type: DataType.INTEGER,
      references: {model: Task, key: "id"},
   })
   declare taskId: number;

   @Column({
      type: DataType.INTEGER,
      allowNull: false,
   })
   declare allowedPauses: number;

   @HasMany(() => Task, {foreignKey: "taskId"})
   declare tasks: Task[];
}

export interface IActivityAttributes {
   name: string,
   description: string | null,
   hours: number,
   minutes: number,
   allowedPauses: number,
}
