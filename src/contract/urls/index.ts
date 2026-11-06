import { Injectable, inject } from "@angular/core";
import { BASE_PATH_DEFAULT } from "../tokens";

@Injectable({ providedIn: 'root' })
export class ApiUrls {
    private readonly basePath = inject(BASE_PATH_DEFAULT);

    public getListItemsUrl(gallery: string): string {
        return `${this.basePath}/api/AssetBrowser/${gallery}`;
    }

    public getListGroupUrl(groupId: number): string {
        return `${this.basePath}/api/AssetBrowser/group/${groupId}`;
    }

    public getGroupAssetInfoUrl(assetId: number): string {
        return `${this.basePath}/api/Assets/position/${assetId}`;
    }

    public getAssetInfoUrl(assetId: number): string {
        return `${this.basePath}/api/Assets/${assetId}`;
    }

    public getAssetTagsUrl(assetId: number): string {
        return `${this.basePath}/api/Assets/${assetId}/tags`;
    }

    public postAddAssetTagsUrl(assetId: number): string {
        return `${this.basePath}/api/Assets/${assetId}/tags`;
    }

    public deleteRemoveAssetTagUrl(assetId: number, tag: string): string {
        return `${this.basePath}/api/Assets/${assetId}/tags/${tag}`;
    }

    public getGalleriesUrl(): string {
        return `${this.basePath}/api/Gallery`;
    }

    public getGalleryByNameUrl(name: string): string {
        return `${this.basePath}/api/Gallery/${name}`;
    }

    public getGroupsListUrl(id: number): string {
        return `${this.basePath}/api/Gallery/${id}/groups`;
    }

    public getGroupDetailsUrl(id: number): string {
        return `${this.basePath}/api/Groups/${id}`;
    }

    public postGroupSetPositonsUrl(id: number): string {
        return `${this.basePath}/api/Groups/${id}/positions`;
    }

    public postGroupSetCoverUrl(id: number): string {
        return `${this.basePath}/api/Groups/${id}/cover`;
    }

    public postCreateGroupUrl(): string {
        return `${this.basePath}/api/Groups`;
    }

    public postGroupAddAssetUrl(): string {
        return `${this.basePath}/api/Groups/assets`;
    }

    public deleteGroupRemoveAssetUrl(): string {
        return `${this.basePath}/api/Groups/assets`;
    }

    public getAssetUrl(id: number): string {
        return `${this.basePath}/api/Media/asset/${id}`;
    }

    public headAssetHeadUrl(id: number): string {
        return `${this.basePath}/api/Media/asset/${id}`;
    }

    public getAssetPreviewUrl(id: number): string {
        return `${this.basePath}/api/Media/asset/preview/${id}`;
    }

    public headAssetPreviewHeadUrl(id: number): string {
        return `${this.basePath}/api/Media/asset/preview/${id}`;
    }

    public getGroupPreviewUrl(id: number): string {
        return `${this.basePath}/api/Media/group/preview/${id}`;
    }

    public headGroupPreviewHeadUrl(id: number): string {
        return `${this.basePath}/api/Media/group/preview/${id}`;
    }

    public getAssetMimeTypeUrl(id: number): string {
        return `${this.basePath}/api/Media/asset/${id}/mime-type`;
    }

    public getSearchTagsUrl(): string {
        return `${this.basePath}/api/Tags/search`;
    }

    public getListTagsUrl(): string {
        return `${this.basePath}/api/Tags/list`;
    }

    public postTagCreateUrl(): string {
        return `${this.basePath}/api/Tags`;
    }
}
