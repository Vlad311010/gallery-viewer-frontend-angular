import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToCategoryClassPipe } from '@app/shared/pipes/to-category';
import { TagCategory, TagCategoryType } from "@shared/models/tag-category";
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { TagsService } from '../../../../../contract/services/tags.service';
import { lastValueFrom } from 'rxjs';
import { ApiUrlsService, TagCreateRequestModel } from '@contract/index';
import { NgxToastComponent, NgxToastService } from 'ngx-toastf';
import { toastDefaultOptions } from '@app/shared/utils/toasts-hepler';

@Component({
  selector: 'tag-create',
  styleUrl: './tag-create.component.scss',
  templateUrl: './tag-create.component.html',
  imports: [ToCategoryClassPipe, ReactiveFormsModule],
})
export class TagCreate {
  private readonly tagsService = inject(TagsService);
  private readonly toastService = inject(NgxToastService);

  private categories = [
    TagCategory.author,
    TagCategory.character, 
    TagCategory.general, 
    TagCategory.source
  ];

  readonly form = new FormGroup({
    selectedCategory: new FormControl(TagCategory.author, { nonNullable: true }),
    tagName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)]
    })
  });

  private readonly createTagMutator = injectMutation(() => ({
    mutationFn: (body: TagCreateRequestModel) =>
      lastValueFrom(
        this.tagsService.tagCreate(
          body,
          'body'
        )
      ),

    onSuccess: (body) => {
      this.toastService.showToastSuccess(`tag: ${body.name} [${body.category}]`, 
        toastDefaultOptions({ title: "Created", duration: 5000}),
      );
    },
    
    onError: () => {
      this.toastService.showToastError('', 
        toastDefaultOptions({ title: "operation failed" })
      );
    }
  }));

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const body = { name: value.tagName, category: value.selectedCategory }
    
    await this.createTagMutator.mutateAsync(body);
  }

  
}
