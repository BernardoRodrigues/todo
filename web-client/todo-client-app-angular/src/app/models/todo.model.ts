import { PriorityModel } from "./priority.model";

export interface TodoModel {

  id?: string;
  userId?: string;
  startDate: Date;
  endDate: Date;
  title: string;
  isDone?: boolean;
  isCancelled?: boolean;
  priority?: PriorityModel;
  priorityId?: number;
}
