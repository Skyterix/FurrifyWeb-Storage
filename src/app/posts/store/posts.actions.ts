import {createAction, props} from '@ngrx/store';
import {PageInfo} from '../../shared/model/page-info.model';
import {ArtistWrapper, AttachmentWrapper, MediaWrapper, TagWrapper} from "./posts.reducer";
import {Tag} from "../../shared/model/tag.model";
import {Artist} from "../../shared/model/artist.model";
import {CreatePost} from "../../shared/model/request/create-post.model";
import {QueryPost} from "../../shared/model/query/query-post.model";
import {CreateSource} from "../../shared/model/request/create-source.model";
import {PostCreateStatusEnum} from "../../shared/enum/post-create-status.enum";

// Posts

export const updateSearchParams = createAction(
    '[Posts] Update search params',
    props<{ sortBy: string, order: string, size: number, page: number }>()
);

export const updateSearchQuery = createAction(
    '[Posts] Update search query',
    props<{ query: string }>()
);

export const startSearch = createAction(
    '[Posts] Search start',
    props<{
        query: string,
        sortBy: string,
        order: string,
        size: number,
        page: number,
        userId: string
    }>()
);

export const getPostStart = createAction(
    '[Posts] Get post start',
    props<{
        userId: string,
        postId: string
    }>()
);

export const getPostSuccess = createAction(
    '[Posts] Get post success',
    props<{
        post: QueryPost
    }>()
);

export const getPostFail = createAction(
    '[Posts] Get post fail',
    props<{ postFetchErrorMessage: string }>()
);

export const failSearch = createAction(
    '[Posts] Search fail',
    props<{ searchErrorMessage: string }>()
);

export const successSearch = createAction(
    '[Posts] Search success',
    props<{ posts: QueryPost[], pageInfo: PageInfo }>()
);

export const selectPost = createAction(
    '[Posts] Select post',
    props<{ post: QueryPost | null }>()
);

// Post params

export const updatePostSavedTitle = createAction(
    '[Posts] Update post saved title',
    props<{ title: string }>()
);

export const updatePostSavedDescription = createAction(
    '[Posts] Update post saved description',
    props<{ description: string }>()
);

export const addTagToSelectedSetStart = createAction(
    '[Posts] Add tag to selected set start',
    props<{ userId: string, value: string }>()
);

export const addTagToSelectedSetFail = createAction(
    '[Posts] Add tag to selected set fail',
    props<{ value: string, errorMessage: string }>()
);

export const addTagToSelectedSetSuccess = createAction(
    '[Posts] Add tag to selected set success',
    props<{ tagWrapper: TagWrapper }>()
);

export const createTagStart = createAction(
    '[Posts] Create tag start',
    props<{ userId: string, tag: Tag }>()
);

export const createTagFail = createAction(
    '[Posts] Create tag fail',
    props<{ errorMessage: string }>()
);

export const fetchTagAfterCreationStart = createAction(
    '[Posts] Fetch tag after creation start',
    props<{ userId: string, value: string }>()
);

export const fetchTagAfterCreationFail = createAction(
    '[Posts] Create tag after creation fail',
    props<{ errorMessage: string }>()
);

export const fetchTagAfterCreationSuccess = createAction(
    '[Posts] Fetch tag after creation success',
    props<{ tag: Tag }>()
);

export const removeTagFromSelected = createAction(
    '[Posts] Remove tag from selected',
    props<{ tag: Tag }>()
);

export const addArtistToSelectedSetStart = createAction(
    '[Posts] Add artist to selected set start',
    props<{ userId: string, preferredNickname: string }>()
);

export const addArtistToSelectedSetFail = createAction(
    '[Posts] Add artist to selected set fail',
    props<{ preferredNickname: string, errorMessage: string }>()
);

export const addArtistToSelectedSetSuccess = createAction(
    '[Posts] Add artist to selected set success',
    props<{ artistWrapper: ArtistWrapper }>()
);

export const removeArtistFromSelected = createAction(
    '[Posts] Remove artist from selected',
    props<{ artist: Artist }>()
);

export const createArtistStart = createAction(
    '[Posts] Create artist start',
    props<{ userId: string, artist: Artist, avatar: File }>()
);

export const createArtistFail = createAction(
    '[Posts] Create artist fail',
    props<{ errorMessage: string }>()
);

export const fetchArtistAfterCreationStart = createAction(
    '[Posts] Fetch artist after creation start',
    props<{ userId: string, artistId: string }>()
);

export const fetchArtistAfterCreationFail = createAction(
    '[Posts] Create artist after creation fail',
    props<{ errorMessage: string }>()
);

export const fetchArtistAfterCreationSuccess = createAction(
    '[Posts] Fetch artist after creation success',
    props<{ artist: Artist }>()
);

export const createArtistUploadAvatarStart = createAction(
    '[Posts] Create artist upload avatar start',
    props<{ userId: string, artistId: string, avatar: File }>()
);

export const addMedia = createAction(
    '[Posts] Add media',
    props<{ mediaWrapper: MediaWrapper }>()
);

export const removeMedia = createAction(
    '[Posts] Remove media',
    props<{ index: number }>()
);

export const addMediaSource = createAction(
    '[Posts] Add media source',
    props<{ mediaIndex: number, source: CreateSource }>()
);

export const updateMediaSet = createAction(
    '[Posts] Update media set',
    props<{ mediaSet: MediaWrapper[] }>()
);

export const addAttachment = createAction(
    '[Posts] Add attachment',
    props<{ attachmentWrapper: AttachmentWrapper }>()
);

export const removeAttachment = createAction(
    '[Posts] Remove attachment',
    props<{ index: number }>()
);

export const removeSourceFromMedia = createAction(
    '[Posts] Remove source from media',
    props<{ mediaIndex: number, sourceIndex: number }>()
);

export const updateSourceData = createAction(
    '[Posts] Update source data',
    props<{ data: any }>()
)
export const clearSourceData = createAction(
    '[Posts] Clear source data'
);

// Post creation

export const createPostStart = createAction(
    '[Posts] Create post start',
    props<{
        userId: string,
        createPost: CreatePost,
        mediaSet: MediaWrapper[],
        attachments: AttachmentWrapper[]
    }>()
);

export const createPostFail = createAction(
    '[Posts] Create post fail',
    props<{ errorMessage: string }>()
);

export const createPostSuccess = createAction(
    '[Posts] Create post success',
    props<{ postId: string }>()
);

export const createMediaSetStart = createAction(
    '[Posts] Create media set start',
    props<{
        userId: string,
        postId: string,
        mediaSet: MediaWrapper[],
        currentIndex: number
    }>()
);

export const createMediaSetSuccess = createAction(
    '[Posts] Create media set success'
);

export const createAttachmentsStart = createAction(
    '[Posts] Create attachments start',
    props<{
        userId: string,
        postId: string,
        attachments: AttachmentWrapper[],
        currentIndex: number
    }>()
);

export const createAttachmentsSuccess = createAction(
    '[Posts] Create attachments success'
);

export const updatePostCreateStatus = createAction(
    '[Posts] Update post create status',
    props<{ status: PostCreateStatusEnum }>()
);
