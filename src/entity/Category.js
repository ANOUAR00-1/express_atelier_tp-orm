import { EntitySchema } from "typeorm";

export const Category = new EntitySchema({
 name: "Category",
 tableName: "categories",
 columns: {
  id: {
   primary: true,
   type: "int",
   generated: true,
  },
  name: {
   type: "varchar",
   length: 100,
  },
  description: {
   type: "varchar",
   length: 100,
  },
  created_at: {
   type: "timestamp",
   default: () => "CURRENT_TIMESTAMP",
  },
 },

 relations: {
  products: {
   type: "one-to-many",
   target: "Product",
   inverseSide: "category",
  },
 },
});