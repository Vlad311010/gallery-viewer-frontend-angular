import { Component, input, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'item-link',
  templateUrl: './item-link.component.html',
  imports: [RouterLink]
})
export class ItemLink {
  itemId = input.required<number>();
  isGroup = input.required<boolean>();  
  isEditMode = input<boolean>(false);

  private readonly route = inject(ActivatedRoute);

  private readonly galleryName = this.route.snapshot.paramMap.get('galleryName') ?? "SOME GALLERY";

  private readonly directTo = computed(() =>
    this.isGroup() 
      ? `/group/${this.itemId()}`
      : this.isEditMode() 
        ? `/gallery/${this.galleryName}/asset/${this.itemId()}`
        : `/gallery/${this.galleryName}/asset/${this.itemId()}/view`
  )

  /*
  private readonly directTo = computed(() =>
    isGroup(this.item())
      ? `/group/${this.item().id}`
      : this.isEditMode() 
        ? `/gallery/${this.galleryName}/asset/${this.item().id}`
        : `/gallery/${this.galleryName}/asset/${this.item().id}/view`
  )*/
}