import pgn from '../parsers/pgn.js';

export const SUPERPHYSICAL_REGEXP = pgn.SUPERPHYSICAL_REGEXP;
export const ANNOTATIONS_REGEXP = pgn.ANNOTATIONS_REGEXP;
export const PIECES_REGEXP = pgn.PIECES_REGEXP;
export const PRESENT_REGEXP = pgn.PRESENT_REGEXP;
export const TIMELINE_REGEXP = pgn.TIMELINE_REGEXP;
export const PIECE_TO_NUM = pgn.PIECE_TO_NUM;
export const NUM_TO_PIECE = pgn.NUM_TO_PIECE;
export const DEFAULT_TAGS = pgn.DEFAULT_TAGS;
export const parse = pgn.parse;
export const write = pgn.write;
export const parse_tag = pgn.parse_tag;
export const parse_turn_index = pgn.parse_turn_index;
export const parse_move = pgn.parse_move;
export const parse_comment = pgn.parse_comment;
