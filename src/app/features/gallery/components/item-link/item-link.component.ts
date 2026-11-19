import { Component, input, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly galleryName = this.route.snapshot.paramMap.get('galleryName');

  private readonly directTo = computed(() =>
    this.isGroup() 
      ? `/gallery/${this.galleryName}/group/${this.itemId()}`
      : this.editModeOn() 
        ? `/gallery/${this.galleryName}/asset/${this.itemId()}`
        : `/gallery/${this.galleryName}/asset/${this.itemId()}/view`
  )

}