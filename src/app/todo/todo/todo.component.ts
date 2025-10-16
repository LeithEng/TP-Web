import { Component, inject, signal } from '@angular/core';
import { Todo } from '../model/todo';
import { TodoService } from '../service/todo.service';

import { FormsModule } from '@angular/forms';
import { TodoStatus } from '../types/todo-status.type';
import { TODO_STATUS } from '../const/todo-status.contant';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.css'],
    providers: [TodoService],
    standalone: true,
    imports: [FormsModule],
})
export class TodoComponent {
  private todoService = inject(TodoService);

  TODO_STATUS = TODO_STATUS;

  waitingTodos = this.todoService.waitingTodos;
  inProgressTodos = this.todoService.inProgressTodos
  doneTodos = this.todoService.doneTodos;

  todoName = signal('');
  todoContent = signal('');

  addTodo(){
    this.todoService.addTodo(this.todoName(), this.todoContent());
    this.todoName.set('');
    this.todoContent.set('');
  }
  updateStatus(id: number, newStatus: TodoStatus){
    this.todoService.updateTodoStatus(id, newStatus);
  }
  
  deleteTodo(id: number){
    this.todoService.deteleTodo(id);
  }
}
