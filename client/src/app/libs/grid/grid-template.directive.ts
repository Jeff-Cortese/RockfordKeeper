import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, Directive, Input, TemplateRef } from '@angular/core';

import { IAfterGuiAttachedParams, ICellRendererParams, IHeaderParams } from 'ag-grid';
import { AgGridColumn, ICellRendererAngularComp, IHeaderAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'dynamic-template-cell',
  template: `<ng-container *ngTemplateOutlet="template; context: templateContext"></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicTemplateCellComponent implements ICellRendererAngularComp {
  @Input() template: TemplateRef<any>;

  params: ICellRendererParams;

  get templateContext() {
    return {
      $implicit: this.params.value,
      params: this.params,
      row: this.params.data,
      rowNode: this.params.node
    };
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.template = (params as any).template;
  }

  refresh(params: any): boolean {
    return false;
  }
}

@Component({
  selector: 'dynamic-template-header',
  template: `<ng-container *ngTemplateOutlet="template; context: templateContext"></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicTemplateHeaderComponent implements IHeaderAngularComp {
  @Input() template: TemplateRef<any>;

  params: IHeaderParams;

  get templateContext() {
    return {
      $implicit: this.params.column,
      column: this.params.column,
      displayName: this.params.displayName
    };
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  agInit(params: IHeaderParams): void {
    this.params = params;
    this.template = (params as any).template;
  }
}

@Directive({
  selector: '[column-cell-template]'
})
export class ColumnCellTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({
  selector: '[column-header-template]'
})
export class ColumnHeaderTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({
  selector: '[grid-template]'
})
export class GridTemplateDirective implements AfterContentInit {
  @Input() fixedWidth: number;
  @ContentChild(TemplateRef) implicitCellTemplate: TemplateRef<any>;
  @ContentChild(ColumnCellTemplateDirective) cellTemplate: ColumnCellTemplateDirective;
  @ContentChild(ColumnHeaderTemplateDirective) headerTemplate: ColumnHeaderTemplateDirective;

  constructor(private host: AgGridColumn) {}

  ngAfterContentInit(): void {
    if (this.cellTemplate || this.implicitCellTemplate) {
      this.host.cellRendererFramework = DynamicTemplateCellComponent;
      this.host.cellRendererParams = { template: this.cellTemplate && this.cellTemplate.templateRef || this.implicitCellTemplate };
    }
    if (this.headerTemplate) {
      this.host.headerComponentFramework = DynamicTemplateHeaderComponent;
      this.host.headerComponentParams = { template: this.headerTemplate.templateRef };
    }

    if (!this.host.comparator) {
      this.host.comparator = (valueA, valueB) => typeof valueA === 'string'
        ? valueA.localeCompare(valueB)
        : (valueA > valueB ? 1 : (valueA < valueB ? -1 : 0));
    }

    this.host.headerTooltip = this.host.headerName;

    if (this.fixedWidth) {
      this.host.width = this.fixedWidth;
      this.host.minWidth = this.fixedWidth;
      this.host.maxWidth = this.fixedWidth;
    }
  }
}
