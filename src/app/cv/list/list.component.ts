import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Cv } from "../model/cv";

@Component({
  standalone: false,
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"],
})
export class ListComponent {
  @Input() cvs: Cv[] | null = [];
}
