export const KEYCLOAK_AUTH_URL = "http://192.168.0.200:6565";
export const KEYCLOAK_REALM = "dev";
export const KEYCLOAK_CLIENT_ID = "furrifyws-storage";
export const KEYCLOAK_PROVIDER_LINK = "/realms/" + KEYCLOAK_REALM + "/broker/:provider/link";

export const CDN_ADDRESS = 'http://localhost';
export const SERVER_ADDRESS = 'http://localhost:8080';
export const GET_POSTS_BY_QUERY = SERVER_ADDRESS + '/users/:userId/posts/search';
export const GET_POST = SERVER_ADDRESS + '/users/:userId/posts/:postId';
export const GET_TAG = SERVER_ADDRESS + '/users/:userId/tags/:value';
export const GET_ARTIST = SERVER_ADDRESS + '/users/:userId/artists/:artistId';
export const GET_SOURCE = SERVER_ADDRESS + '/users/:userId/sources/:sourceId';
export const GET_ARTISTS_BY_PREFERRED_NICKNAME = SERVER_ADDRESS + '/users/:userId/artists';

export const GET_POST_MEDIA_SOURCES = SERVER_ADDRESS + '/users/:userId/posts/:postId/media/:mediaId/sources';
export const GET_ARTIST_SOURCES = SERVER_ADDRESS + '/users/:userId/artists/:artistId/sources';
export const GET_POST_ATTACHMENT_SOURCES = SERVER_ADDRESS + '/users/:userId/posts/:postId/attachments/:attachmentId/sources';


export const CREATE_TAG = SERVER_ADDRESS + '/users/:userId/tags';
export const CREATE_ARTIST = SERVER_ADDRESS + '/users/:userId/artists';
export const CREATE_POST = SERVER_ADDRESS + '/users/:userId/posts';
export const CREATE_MEDIA = SERVER_ADDRESS + '/users/:userId/posts/:postId/media';
export const CREATE_ATTACHMENT = SERVER_ADDRESS + '/users/:userId/posts/:postId/attachments';
export const CREATE_AVATAR = SERVER_ADDRESS + '/users/:userId/artists/:artistId/avatar';

export const CREATE_MEDIA_SOURCE = SERVER_ADDRESS + '/users/:userId/posts/:postId/media/:mediaId/sources';
export const CREATE_ATTACHMENT_SOURCE = SERVER_ADDRESS + '/users/:userId/posts/:postId/attachments/:attachmentId/sources';
export const CREATE_ARTIST_SOURCE = SERVER_ADDRESS + '/users/:userId/artists/:artistId/sources';

export const DELETE_POST = SERVER_ADDRESS + '/users/:userId/posts/:postId';
export const DELETE_ARTIST = SERVER_ADDRESS + '/users/:userId/artists/:artistId';
export const DELETE_MEDIA = SERVER_ADDRESS + '/users/:userId/posts/:postId/media/:mediaId';
export const DELETE_ATTACHMENT = SERVER_ADDRESS + '/users/:userId/posts/:postId/attachments/:attachmentId';

export const DELETE_SOURCE = SERVER_ADDRESS + '/users/:userId/sources/:sourceId';

export const REPLACE_POST = SERVER_ADDRESS + '/users/:userId/posts/:postId';

// Fixes not getting hal+json from response
export const RESPONSE_TYPE = "*";
