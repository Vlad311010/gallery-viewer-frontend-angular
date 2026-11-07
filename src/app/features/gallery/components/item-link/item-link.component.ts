import { Component, input, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'item-link',
  templateUrl: './item-link.component.html',
  styleUrl: './item-link.component.scss',
  imports: [RouterLink]
})
export class ItemLink {
  itemId = input.required<number>();
  isGroup = input.required<boolean>();  
  editModeOn = input.required<boolean>();

  private readonly route = inject(ActivatedRoute);

  private readonly galleryName = this.route.snapshot.paramMap.get('galleryName') ?? "SOME GALLERY";

  private readonly directTo = computed(() =>
    this.isGroup() 
      ? `group/${this.itemId()}`
      : this.editModeOn() 
        ? `asset/${this.itemId()}`
        : `asset/${this.itemId()}/view`
  )

}