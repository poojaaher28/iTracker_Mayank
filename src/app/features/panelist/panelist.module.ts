import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";




import { AddslotsComponent } from "./addslots/addslots.component";
import { AddslotsService } from "./addslots/addslots.service";
import { HttpClientModule } from "@angular/common/http";
@NgModule({
  declarations: [AddslotsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule, HttpClientModule],
  providers: [AddslotsService],
  exports: [AddslotsComponent],
})
export class PanelistModule {}
