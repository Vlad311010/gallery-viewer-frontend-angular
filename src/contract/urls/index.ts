import { Injectable, inject } from "@angular/core";
import { BASE_PATH_DEFAULT } from "../tokens";

export type QueryKeyDescriptor = [
    url: string,
    parameters: Record<string, unknown>
];

@Injectable({ providedIn: 'root' })
export class ApiUrlsService {
    private readonly basePath = inject(BASE_PATH_DEFAULT);

    public getListItemsUrl(gallery: string): string {
        return `${this.basePath}/api/AssetBrowser/${gallery}`;
    }

    public getListItemsQueryKey(gallery: string): QueryKeyDescriptor {
        return [
            "getListItems",
            { gallery: gallery }
        ];
    }

    public getListGroupUrl(groupId: number): string {
        return `${this.basePath}/api/AssetBrowser/group/${groupId}`;
    }

    public getListGroupQueryKey(groupId: number): QueryKeyDescriptor {
        return [
            "getListGroup",
            { groupId: groupId }
        ];
    }

    public getGroupAssetInfoUrl(assetId: number): string {
        return `${this.basePath}/api/Assets/position/${assetId}`;
    }

    public getGroupAssetInfoQueryKey(assetId: number): QueryKeyDescriptor {
        return [
            "getGroupAssetInfo",
            { assetId: assetId }
        ];
    }

    public getAssetInfoUrl(assetId: number): string {
        return `${this.basePath}/api/Assets/${assetId}`;
    }

    public getAssetInfoQueryKey(assetId: number): QueryKeyDescriptor {
        return [
            "getAssetInfo",
            { assetId: assetId }
        ];
    }

    public getAssetTagsUrl(assetId: number): string {
        return `${this.basePath}/api/Assets/${assetId}/tags`;
    }

    public getAssetTagsQueryKey(assetId: number): QueryKeyDescriptor {
        return [
            "getAssetTags",
            { assetId: assetId }
        ];
    }

    public postAddAssetTagsUrl(assetId: number): string {
        return `${this.basePath}/api/Assets/${assetId}/tags`;
    }

    public postAddAssetTagsQueryKey(assetId: number): QueryKeyDescriptor {
        return [
            "postAddAssetTags",
            { assetId: assetId }
        ];
    }

    public deleteRemoveAssetTagUrl(assetId: number, tag: string): string {
        return `${this.basePath}/api/Assets/${assetId}/tags/${tag}`;
    }

    public deleteRemoveAssetTagQueryKey(assetId: number, tag: string): QueryKeyDescriptor {
        return [
            "deleteRemoveAssetTag",
            { assetId: assetId, tag: tag }
        ];
    }

    public getGalleriesUrl(): string {
        return `${this.basePath}/api/Gallery`;
    }

    public getGalleriesQueryKey(): QueryKeyDescriptor {
        return [
            "getGalleries",
            {}
        ];
    }

    public getGalleryByNameUrl(name: string): string {
        return `${this.basePath}/api/Gallery/${name}`;
    }

    public getGalleryByNameQueryKey(name: string): QueryKeyDescriptor {
        return [
            "getGalleryByName",
            { name: name }
        ];
    }

    public getGroupsListUrl(id: number): string {
        return `${this.basePath}/api/Gallery/${id}/groups`;
    }

    public getGroupsListQueryKey(id: number): QueryKeyDescriptor {
        return [
            "getGroupsList",
            { id: id }
        ];
    }

    public getGroupDetailsUrl(id: number): string {
        return `${this.basePath}/api/Groups/${id}`;
    }

    public getGroupDetailsQueryKey(id: number): QueryKeyDescriptor {
        return [
            "getGroupDetails",
            { id: id }
        ];
    }

    public postGroupSetPositonsUrl(id: number): string {
        return `${this.basePath}/api/Groups/${id}/positions`;
    }

    public postGroupSetPositonsQueryKey(id: number): QueryKeyDescriptor {
        return [
            "postGroupSetPositons",
            { id: id }
        ];
    }

    public postGroupSetCoverUrl(id: number): string {
        return `${this.basePath}/api/Groups/${id}/cover`;
    }

    public postGroupSetCoverQueryKey(id: number): QueryKeyDescriptor {
        return [
            "postGroupSetCover",
            { id: id }
        ];
    }

    public postCreateGroupUrl(): string {
        return `${this.basePath}/api/Groups`;
    }

    public postCreateGroupQueryKey(): QueryKeyDescriptor {
        return [
            "postCreateGroup",
            {}
        ];
    }

    public postGroupAddAssetUrl(): string {
        return `${this.basePath}/api/Groups/assets`;
    }

    public postGroupAddAssetQueryKey(): QueryKeyDescriptor {
        return [
            "postGroupAddAsset",
            {}
        ];
    }

    public deleteGroupRemoveAssetUrl(): string {
        return `${this.basePath}/api/Groups/assets`;
    }

    public deleteGroupRemoveAssetQueryKey(): QueryKeyDescriptor {
        return [
            "deleteGroupRemoveAsset",
            {}
        ];
    }

    public getAssetUrl(id: number): string {
        return `${this.basePath}/api/Media/asset/${id}`;
    }

    public getAssetQueryKey(id: number): QueryKeyDescriptor {
        return [
            "getAsset",
            { id: id }
        ];
    }

    public headAssetHeadUrl(id: number): string {
        return `${this.basePath}/api/Media/asset/${id}`;
    }

    public headAssetHeadQueryKey(id: number): QueryKeyDescriptor {
        return [
            "headAssetHead",
            { id: id }
        ];
    }

    public getAssetPreviewUrl(id: number): string {
        return `${this.basePath}/api/Media/asset/preview/${id}`;
    }

    public getAssetPreviewQueryKey(id: number): QueryKeyDescriptor {
        return [
            "getAssetPreview",
            { id: id }
        ];
    }

    public headAssetPreviewHeadUrl(id: number): string {
        return `${this.basePath}/api/Media/asset/preview/${id}`;
    }

    public headAssetPreviewHeadQueryKey(id: number): QueryKeyDescriptor {
        return [
            "headAssetPreviewHead",
            { id: id }
        ];
    }

    public getGroupPreviewUrl(id: number): string {
        return `${this.basePath}/api/Media/group/preview/${id}`;
    }

    public getGroupPreviewQueryKey(id: number): QueryKeyDescriptor {
        return [
            "getGroupPreview",
            { id: id }
        ];
    }

    public headGroupPreviewHeadUrl(id: number): string {
        return `${this.basePath}/api/Media/group/preview/${id}`;
    }

    public headGroupPreviewHeadQueryKey(id: number): QueryKeyDescriptor {
        return [
            "headGroupPreviewHead",
            { id: id }
        ];
    }

    public getAssetMimeTypeUrl(id: number): string {
        return `${this.basePath}/api/Media/asset/${id}/mime-type`;
    }

    public getAssetMimeTypeQueryKey(id: number): QueryKeyDescriptor {
        return [
            "getAssetMimeType",
            { id: id }
        ];
    }

    public getSearchTagsUrl(): string {
        return `${this.basePath}/api/Tags/search`;
    }

    public getSearchTagsQueryKey(): QueryKeyDescriptor {
        return [
            "getSearchTags",
            {}
        ];
    }

    public getListTagsUrl(): string {
        return `${this.basePath}/api/Tags/list`;
    }

    public getListTagsQueryKey(): QueryKeyDescriptor {
        return [
            "getListTags",
            {}
        ];
    }

    public postTagCreateUrl(): string {
        return `${this.basePath}/api/Tags`;
    }

    public postTagCreateQueryKey(): QueryKeyDescriptor {
        return [
            "postTagCreate",
            {}
        ];
    }
}
