import { Component, input, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'item-link',
  templateUrl: './item-link.component.html',
  imports: [RouterLink]
})
export class ItemLink {
  itemId = input.required<number>();
  isEditMode = input<boolean>(false);
  isGroup = input<boolean>(false);  

  private readonly route = inject(ActivatedRoute);

  private readonly galleryName = this.route.snapshot.paramMap.get('galleryName') ?? "SOME GALLERY";

  private readonly directTo = computed(() =>
    this.isGroup() 
      ? `/group/${this.itemId()}`
      : this.isEditMode() 
        ? `/gallery/${this.galleryName}/asset/${this.itemId()}`
        : `/gallery/${this.galleryName}/asset/${this.itemId()}/view`
  )
}