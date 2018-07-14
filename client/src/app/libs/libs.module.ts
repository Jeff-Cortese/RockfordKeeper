import { NgModule } from '@angular/core';
import { CommonModule as AngularCommon, TitleCasePipe } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import {
  GridTemplateDirective,
  DynamicTemplateCellComponent,
  DynamicTemplateHeaderComponent,
  ColumnCellTemplateDirective,
  ColumnHeaderTemplateDirective
} from './grid/grid-template.directive';

const agGridAwareComponents = [
  DynamicTemplateCellComponent,
  DynamicTemplateHeaderComponent
];

const gridComponents = [
  GridTemplateDirective,
  ColumnCellTemplateDirective,
  ColumnHeaderTemplateDirective
];

@NgModule({
  imports: [AngularCommon, AgGridModule.withComponents(agGridAwareComponents)],
  exports: [gridComponents],
  declarations: [
    ...agGridAwareComponents,
    ...gridComponents
  ],
  providers: [],
})
export class LibsModule {}
