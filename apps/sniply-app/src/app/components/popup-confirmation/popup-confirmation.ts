import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup-confirmation',
  templateUrl: './popup-confirmation.html',
  styleUrl: './popup-confirmation.scss',
})
export class PopupConfirmationComponent {
  @Input() visible = false;
  @Input() title = 'Confirm action';
  @Input() message = 'Are you sure you want to continue?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() loading = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  protected onConfirm() {
    if (this.loading) {
      return;
    }

    this.confirmed.emit();
  }

  protected onCancel() {
    if (this.loading) {
      return;
    }

    this.cancelled.emit();
  }
}
