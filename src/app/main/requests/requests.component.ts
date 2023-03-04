import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Project } from 'src/models/project.interface';
import { elementAt, Observable, Subscription } from 'rxjs';
import { RequestService } from 'src/providers/request.service';
import { Request } from 'src/models/request.interface';
import { MatDialog } from '@angular/material/dialog';
import { RequestContextMenuComponent } from './request-context-menu/request-context-menu.component';
import { DialogResult } from 'src/models/enums/dialog-result';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

  constructor(private requestService: RequestService, private dialog: MatDialog) {

  }

  private eventsSubscription?: Subscription;
  @Input() project$?: Observable<Project>

  @Output() onRequestSelected = new EventEmitter<Request | undefined>()

  project?: Project
  requests?: Request[]
  selectedRequest?: Request

  ngOnInit() {
    this.eventsSubscription = this.project$?.subscribe(project => {
      this.project = project
      this.requestService.getProjectRequests(project).subscribe(result => {
        this.requests = result
      })
      this.selectedRequest = undefined
      this.onRequestSelected.emit(undefined)
    })
  }

  onDoubleClick(request: Request) {
    // search item selected
    const div = document.getElementById("requests_list")?.getElementsByClassName("selected_true")[0]

    // set edittable to item selected
    const span = div!.getElementsByTagName("h5")[0]
    span.contentEditable = "true"

    span?.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        span.contentEditable = "false"
        request.name = span.textContent!

        const newSpan = span.cloneNode(true)
        span.replaceWith(newSpan)
      }
    })

    span.addEventListener("blur", e => {
      span.contentEditable = "false"
      request.name = span.textContent!

      const newSpan = span.cloneNode(true)
      span.replaceWith(newSpan)
    })
  }

  createRequest() {
    this.requestService.addRequest(this.project!)
  }

  onRequestClicked(request: Request) {
    this.selectedRequest = request
    this.onRequestSelected.emit(request)
  }

  onRightClick(event: MouseEvent, request: Request) {

    const instance = this.dialog.open(RequestContextMenuComponent, {
      data: request,
      position: {
        left: event.clientX + "px",
        top: event.clientY + "px"
      }
    })

    instance.afterClosed().subscribe(result => {
      // if request deleted
      if (result == DialogResult.Delete) {
        this.selectedRequest = undefined
        this.onRequestSelected.emit(undefined)
      }
      else if (result == DialogResult.Rename) {
        console.log("rename");

      }
    })
  }
}
