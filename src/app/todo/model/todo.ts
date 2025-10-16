import { TodoStatus } from "../types/todo-status.type";


export interface Todo {
  id: number;
  name: string;
  content: string;
  status: TodoStatus;
}

