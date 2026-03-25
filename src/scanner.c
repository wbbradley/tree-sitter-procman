#include "tree_sitter/parser.h"

enum TokenType {
  FENCED_STRING,
};

void *tree_sitter_procman_external_scanner_create(void) { return NULL; }
void tree_sitter_procman_external_scanner_destroy(void *payload) { (void)payload; }

unsigned tree_sitter_procman_external_scanner_serialize(void *payload,
                                                        char *buffer) {
  (void)payload;
  (void)buffer;
  return 0;
}

void tree_sitter_procman_external_scanner_deserialize(void *payload,
                                                      const char *buffer,
                                                      unsigned length) {
  (void)payload;
  (void)buffer;
  (void)length;
}

bool tree_sitter_procman_external_scanner_scan(void *payload, TSLexer *lexer,
                                               const bool *valid_symbols) {
  (void)payload;

  if (!valid_symbols[FENCED_STRING]) {
    return false;
  }

  /* Skip whitespace since tree-sitter may not have consumed extras yet */
  while (lexer->lookahead == ' ' || lexer->lookahead == '\t' ||
         lexer->lookahead == '\n' || lexer->lookahead == '\r') {
    lexer->advance(lexer, true);
  }

  /* Match opening ``` */
  if (lexer->lookahead != '`') return false;
  lexer->advance(lexer, false);
  if (lexer->lookahead != '`') return false;
  lexer->advance(lexer, false);
  if (lexer->lookahead != '`') return false;
  lexer->advance(lexer, false);

  /* Consume content until closing ``` */
  unsigned backtick_count = 0;
  for (;;) {
    if (lexer->eof(lexer)) return false;

    if (lexer->lookahead == '`') {
      backtick_count++;
      lexer->advance(lexer, false);
      if (backtick_count == 3) {
        lexer->result_symbol = FENCED_STRING;
        return true;
      }
    } else {
      backtick_count = 0;
      lexer->advance(lexer, false);
    }
  }
}
