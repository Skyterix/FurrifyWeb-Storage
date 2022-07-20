// Extracted extension will be in [1] position in array.
export const EXTENSION_EXTRACT_REGEX = /(?:\.([^.]+))?$/;
export const FILENAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9() ._-]*[a-zA-Z0-9() ._-])?\.[a-zA-Z0-9_-]+$/;
export const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/;
export const ARTIST_REGEX = /^[a-zA-Z0-9_-]*$/;
export const TAG_REGEX = /^[a-zA-Z0-9_-]*$/;

export const TAG_VALUE_MAX_LENGTH = 64;
export const ARTIST_NICKNAME_MAX_LENGTH = 256;

export const MAX_TAGS_IN_POST = 3;
export const MAX_ARTISTS_IN_POST = 3;
