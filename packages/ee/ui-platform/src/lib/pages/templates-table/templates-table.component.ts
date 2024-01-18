import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { startWith } from 'rxjs';
import {
  DeleteEntityDialogComponent,
  DeleteEntityDialogData,
  TemplatesService,
  featureDisabledTooltip,
} from '@activepieces/ui/common';
import { TemplatesDataSource } from './templates-table.datasource';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateOrUpdateTemplateDialogData,
  CreateOrUpdateTemplateDialogueComponent,
} from '../../components/dialogs/create-or-update-template-dialogue/create-or-update-template-dialogue.component';
import { FlowTemplate } from '@activepieces/shared';
import { ActivatedRoute } from '@angular/router';
import { PLATFORM_RESOLVER_KEY } from '../../platform.resolver';
import { Platform } from '@activepieces/ee-shared';

@Component({
  selector: 'app-template-table',
  templateUrl: './templates-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesTableComponent {
  title = $localize`Templates`;
  displayedColumns = ['name', 'created', 'pieces', 'action'];
  dataSource: TemplatesDataSource;
  refresh$: Subject<boolean> = new Subject();
  dialogClosed$?: Observable<unknown>;
  platform: Platform;
  featureDisabledTooltip = featureDisabledTooltip;
  constructor(
    private templateService: TemplatesService,
    private matDialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.platform = this.route.snapshot.data[PLATFORM_RESOLVER_KEY];
    this.dataSource = new TemplatesDataSource(
      this.refresh$.asObservable().pipe(startWith(false)),
      this.templateService,
      this.platform.isDemo || false
    );
  }
  create() {
    const dialog = this.matDialog.open(CreateOrUpdateTemplateDialogueComponent);
    this.dialogClosed$ = dialog.afterClosed().pipe(
      tap((res) => {
        if (res) {
          this.refresh$.next(true);
        }
      })
    );
  }
  edit(template: FlowTemplate) {
    const data: CreateOrUpdateTemplateDialogData = { template };
    const dialog = this.matDialog.open(
      CreateOrUpdateTemplateDialogueComponent,
      {
        data,
      }
    );
    this.dialogClosed$ = dialog.afterClosed().pipe(
      tap((res) => {
        if (res) {
          this.refresh$.next(true);
        }
      })
    );
  }
  deleteTemplate(key: FlowTemplate) {
    const dialogData: DeleteEntityDialogData = {
      deleteEntity$: this.templateService.delete(key.id),
      entityName: key.name,
      note: $localize`This will permanently delete the flow template.`,
    };
    const dialog = this.matDialog.open(DeleteEntityDialogComponent, {
      data: dialogData,
    });
    this.dialogClosed$ = dialog.beforeClosed().pipe(
      tap((res) => {
        if (res) {
          this.refresh$.next(true);
        }
      })
    );
  }
}
