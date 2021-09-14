import { TodoModel } from "./todo.model";

export interface UserModel {

  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  todos?: TodoModel[];

}
