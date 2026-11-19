import { Component, inject, input } from '@angular/core';
import { FiltersInput } from '../filters-input/filters-input.component';
import { GroupsService } from '@contract/services/groups.service';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ApiUrlsService, CreateGroupRequestModel, GalleryService } from '@contract/index';
import { NgxToastService } from 'ngx-toastf';
import { toastDefaultOptions } from '@app/shared/utils/toasts-hepler';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'navigation-bar',
  styleUrl: './navigation-bar.component.scss',
  templateUrl: './navigation-bar.component.html',
  imports: [FiltersInput],
})
export class NavigationBar {
  galleryName = input.required<string>();

  protected readonly urlsService = inject(ApiUrlsService)
  protected readonly groupsService = inject(GroupsService);
  protected readonly galleriesService = inject(GalleryService);  
  protected readonly toastService = inject(NgxToastService);
  protected readonly router = inject(Router);  
  protected readonly route = inject(ActivatedRoute);  

  private readonly galleryQuery = injectQuery(() => ({
    queryKey: [
      GalleryService.name,
      ...this.urlsService.getGalleryByNameQueryKey(this.galleryName())
    ],
    queryFn: () => {
      return lastValueFrom(this.galleriesService.galleryByName(this.galleryName()));
    }
  }))

  createGroupMutator = injectMutation(() => ({
    mutationFn: (body: CreateGroupRequestModel) =>
      lastValueFrom(
        this.groupsService.createGroup(
          body,
          'body'
        )
      ),

    onSuccess: (body) => {
      this.toastService.showToastSuccess('', 
        toastDefaultOptions({ title: `Group id: ${body.groupId}` })
      );
    },
    
    onError: () => {
      this.toastService.showToastError('', 
        toastDefaultOptions({ title: "failed to attach create group" })
      );
    }
  }));

  async onGroupCreate() {
    const galleryId = this.galleryQuery.data()?.id;
    const name = window.prompt("Enter group name:");
    if (name !== null && galleryId) {
      const group = await this.createGroupMutator.mutateAsync({ galleryId: galleryId, groupName: name });
      this.router.navigate([`group/${group.groupId}`], 
        { 
          relativeTo: this.route,
          queryParams: { returnUrl: this.router.url }
        });
    }
  }
}
