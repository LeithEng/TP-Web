import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Todo } from '../model/todo';
import { LoggerService } from '../../services/logger.service';
import { TodoStatus } from '../types/todo-status.type';
import { TODO_STATUS } from '../const/todo-status.contant';

let ID = 1;

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  
  loggerService = inject(LoggerService);

  todoSignal = signal<Todo[]>([]);

  waitingTodos = computed(() => this.todoSignal().filter(todo => todo.status === TODO_STATUS.WAITING));
  
  inProgressTodos = computed(() => this.todoSignal().filter(todo => todo.status === TODO_STATUS.IN_PROGRESS));
  
  doneTodos = computed(() => this.todoSignal().filter(todo => todo.status === TODO_STATUS.DONE));
  
  addTodo(name: string, content: string) {
    const newTodo: Todo = {
      id: ID++,
      name,
      content,
      status: TODO_STATUS.WAITING
    };
    this.todoSignal.update(todos => [...todos, newTodo]);
    this.loggerService.logger(`Added todo: ${name}`);
  }

  updateTodoStatus(id: number, newStatus: TodoStatus) {
    this.todoSignal.update(todos => 
      todos.map(todo => 
        todo.id === id ? { ...todo, status: newStatus } : todo
      )
    );
    this.loggerService.logger(`Updated todo ID ${id} to status: ${newStatus}`);
  }

  deteleTodo(id: number) {
    this.todoSignal.update(todos => todos.filter(todo => todo.id !== id));
    this.loggerService.logger(`Deleted todo ID: ${id}`);
  }



  



 
}
