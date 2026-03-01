import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-register-success-page',
  imports: [RouterModule, AsyncPipe],
  templateUrl: './register-success-page.html',
  styleUrl: './register-success-page.scss',
})
export class RegisterSuccessPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly email$ = this.route.queryParamMap.pipe(
    map((params) => params.get('email')?.trim() ?? ''),
  );

  protected readonly verifyToken$ = this.route.queryParamMap.pipe(
    map((params) => params.get('token')?.trim() ?? ''),
  );
}
