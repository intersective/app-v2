import { Component, Input, OnInit, OnChanges, SimpleChanges , ViewChild, ElementRef} from '@angular/core';
import { FilestackService } from '@shared/filestack/filestack.service';
import { UtilsService } from '@services/utils.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-file-display',
  templateUrl: 'file-display.component.html',
  styleUrls: ['file-display.component.scss']
})
export class FileDisplayComponent implements OnInit, OnChanges {
  private virusDetection: any;
  private quarantine: any;

  @Input() fileType = 'any';
  @Input() file: any;
  @ViewChild('videoEle') videoEle: ElementRef;

  constructor(private filestackService: FilestackService, private utils: UtilsService) { }

  ngOnInit() {
    if (this.file && this.file.workflows) {
      this._updateWorkflowStatus();
    }
  }

  private _updateWorkflowStatus(file?) {
    this._resetUILogic();
    // don't do virus detection on development environment
    if (!environment.production) {
      return ;
    }
    const currentFile = file || this.file;
    this.filestackService.getWorkflowStatus(currentFile.workflows).then(responds => {
      this.utils.each((responds || []), res => {
        const { results, status } = res;

        if (status.toLowerCase() === 'finished') { // status: Finished / InProgress
          const { virus_detection, quarantine } = results;

          if (this.utils.isEmpty(this.virusDetection) && virus_detection && virus_detection.data) {
            this.virusDetection = virus_detection.data;
          }

          if (this.utils.isEmpty(this.quarantine) && quarantine && quarantine.data) {
            this.quarantine = quarantine.data;
          }
        }
      });
    });
  }

  private _resetUILogic() {
    this.virusDetection = {};
    this.quarantine = {};
    if (this.videoEle) {
      this.videoEle.nativeElement.load();
    }
  }

  ngOnChanges(change: SimpleChanges) {
    if (change.file.currentValue && change.file.currentValue.workflows) {
      this._updateWorkflowStatus(change.file.currentValue);
    }
  }

  async previewFile(file) {
    try {
      return await this.filestackService.previewFile(file);
    } catch (err) {
      return err;
    }
  }
}
