export const KEYCLOAK_AUTH_URL = "http://192.168.0.200:6565/auth";
export const KEYCLOAK_REALM = "dev";
export const KEYCLOAK_CLIENT_ID = "furrifyws-storage";

export const SERVER_ADDRESS = 'http://localhost:8080';
export const GET_POSTS_BY_QUERY = SERVER_ADDRESS + '/users/:userId/posts/search';
export const GET_POST = SERVER_ADDRESS + '/users/:userId/posts/:postId';
export const GET_TAG = SERVER_ADDRESS + '/users/:userId/tags/:value';
export const GET_ARTIST = SERVER_ADDRESS + '/users/:userId/artists/:artistId';
export const GET_ARTISTS_BY_PREFERRED_NICKNAME = SERVER_ADDRESS + '/users/:userId/artists';

export const CREATE_TAG = SERVER_ADDRESS + '/users/:userId/tags';
export const CREATE_ARTIST = SERVER_ADDRESS + '/users/:userId/artists';
export const CREATE_POST = SERVER_ADDRESS + '/users/:userId/posts';

// Fixes not getting hal+json from response
export const RESPONSE_TYPE = "*";
