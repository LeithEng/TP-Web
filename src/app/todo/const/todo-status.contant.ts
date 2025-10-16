import { TodoStatus } from "../types/todo-status.type";


export const TODO_STATUS = {
  WAITING: 'waiting' as TodoStatus,
  IN_PROGRESS: 'in progress' as TodoStatus,
  DONE: 'done' as TodoStatus
} as const;