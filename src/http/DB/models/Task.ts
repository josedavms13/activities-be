/* eslint-disable new-cap */
import {Column, DataType, Model, Table} from "sequelize-typescript";


@Table
export class Task extends Model<Task, taskAttributes> {
   @Column({type: DataType.STRING})
   declare name: string;

   /* @HasMany(()=> Model, {foreignKey: "foreignKey"})
   declare models: Model[]; */
}


interface taskAttributes {
   name: string,
   other: string,
}
