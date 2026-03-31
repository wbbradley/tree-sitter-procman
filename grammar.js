/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "procman",

  externals: $ => [$.fenced_string],

  extras: $ => [/\s/, $.comment],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._top_level),

    _top_level: $ => choice(
      $.import_definition,
      $.config_block,
      $.arg_definition,
      $.env_single,
      $.env_block,
      $.job_definition,
      $.service_definition,
      $.event_definition,
    ),

    comment: _ => token(seq("#", /.*/)),

    // ── Tokens ───────────────────────────────────────────────────────

    identifier: _ => /[a-zA-Z_][a-zA-Z0-9_-]*/,

    string: $ => seq(
      '"',
      repeat(choice($.escape_sequence, $.string_content)),
      '"',
    ),

    string_content: _ => token.immediate(prec(-1, /[^"\\]+/)),

    escape_sequence: _ => token.immediate(seq("\\", choice('"', "\\", "n", "t"))),

    number: _ => token(prec(-1, /\d+(\.\d+)?/)),

    duration: _ => token(/\d+(\.\d+)?(ms|[sm])/),

    boolean: _ => choice("true", "false"),

    none: _ => "none",

    // ── Imports ──────────────────────────────────────────────────────

    import_definition: $ => seq(
      "import",
      field("path", $.string),
      optional(seq("as", field("alias", $.identifier))),
      optional(seq("{", repeat($.import_binding), "}")),
    ),

    import_binding: $ => seq(
      field("name", $.identifier),
      "=",
      field("value", $._expression),
    ),

    // ── References ───────────────────────────────────────────────────

    job_reference: $ => seq("@", $.identifier),

    job_output_reference: $ => seq("@", $.identifier, ".", $.identifier),

    args_reference: $ => seq("args", ".", $.identifier),

    namespaced_job_reference: $ => seq("@", $.identifier, "::", $.identifier),

    namespaced_job_output_reference: $ => seq(
      "@", $.identifier, "::", $.identifier, ".", $.identifier),

    namespaced_args_reference: $ => seq($.identifier, "::", "args", ".", $.identifier),

    // ── Expressions ──────────────────────────────────────────────────

    _expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.parenthesized_expression,
      $._primary_expression,
    ),

    _primary_expression: $ => choice(
      $.string,
      $.number,
      $.duration,
      $.boolean,
      $.none,
      $.namespaced_args_reference,
      $.args_reference,
      $.namespaced_job_output_reference,
      $.job_output_reference,
      $.identifier,
    ),

    binary_expression: $ => choice(
      prec.left(1, seq($._expression, "||", $._expression)),
      prec.left(2, seq($._expression, "&&", $._expression)),
      prec.left(3, seq($._expression, choice("==", "!=", "<", ">", "<=", ">="), $._expression)),
    ),

    unary_expression: $ => prec(4, seq("!", $._expression)),

    parenthesized_expression: $ => seq("(", $._expression, ")"),

    // ── Config Block ─────────────────────────────────────────────────

    config_block: $ => seq(
      "config",
      "{",
      repeat($._config_item),
      "}",
    ),

    _config_item: $ => $.setting,

    arg_definition: $ => seq(
      "arg",
      field("name", $.identifier),
      "{",
      repeat($.setting),
      "}",
    ),

    // ── Job / Event Definitions ──────────────────────────────────────

    job_definition: $ => seq(
      "job",
      field("name", $.identifier),
      optional(seq("if", field("condition", $._expression))),
      "{",
      repeat($._job_item),
      "}",
    ),

    service_definition: $ => seq(
      "service",
      field("name", $.identifier),
      optional(seq("if", field("condition", $._expression))),
      "{",
      repeat($._job_item),
      "}",
    ),

    event_definition: $ => seq(
      "event",
      field("name", $.identifier),
      "{",
      repeat($._job_item),
      "}",
    ),

    _job_item: $ => choice(
      $.env_single,
      $.env_block,
      $.wait_block,
      $.watch_block,
      $.run_statement,
      $.for_statement,
    ),

    // ── Env ──────────────────────────────────────────────────────────

    env_single: $ => seq(
      "env",
      field("name", $.identifier),
      "=",
      field("value", $._expression),
    ),

    env_block: $ => seq(
      "env",
      "{",
      repeat($.env_pair),
      "}",
    ),

    env_pair: $ => seq(
      field("name", $.identifier),
      "=",
      field("value", $._expression),
    ),

    // ── Run ──────────────────────────────────────────────────────────

    run_statement: $ => seq("run", choice($.string, $.fenced_string)),

    // ── For ──────────────────────────────────────────────────────────

    for_statement: $ => seq(
      "for",
      field("variable", $.identifier),
      "in",
      field("iterable", $._iterable),
      "{",
      repeat(choice($.env_single, $.run_statement)),
      "}",
    ),

    _iterable: $ => choice(
      $.glob_pattern,
      $.array_literal,
      $.range_exclusive,
      $.range_inclusive,
    ),

    glob_pattern: $ => seq("glob", "(", $.string, ")"),

    array_literal: $ => seq(
      "[",
      optional(seq($._expression, repeat(seq(",", $._expression)))),
      "]",
    ),

    range_exclusive: $ => prec.left(seq($._expression, "..", $._expression)),

    range_inclusive: $ => prec.left(seq($._expression, "..=", $._expression)),

    // ── Wait Block ───────────────────────────────────────────────────

    wait_block: $ => seq(
      "wait",
      "{",
      repeat($.wait_condition),
      "}",
    ),

    wait_condition: $ => seq(
      optional("!"),
      $._condition,
    ),

    _condition: $ => choice(
      $.after_condition,
      $.http_condition,
      $.connect_condition,
      $.exists_condition,
      $.running_condition,
      $.contains_condition,
    ),

    after_condition: $ => seq(
      "after",
      choice($.namespaced_job_reference, $.job_reference),
      optional($.condition_options)),
    http_condition: $ => seq("http", $.string, optional($.condition_options)),
    connect_condition: $ => seq("connect", $.string, optional($.condition_options)),
    exists_condition: $ => seq("exists", $.string, optional($.condition_options)),
    running_condition: $ => seq("running", $.string, optional($.condition_options)),

    contains_condition: $ => seq(
      "contains",
      $.string,
      "{",
      repeat($.setting),
      "}",
    ),

    condition_options: $ => seq("{", repeat($.setting), "}"),

    // ── Generic Setting (identifier = expression) ────────────────────

    setting: $ => seq(
      field("name", $.identifier),
      "=",
      field("value", $._expression),
    ),

    // ── Watch Block ──────────────────────────────────────────────────

    watch_block: $ => seq(
      "watch",
      field("name", $.identifier),
      "{",
      $.wait_condition,
      repeat($._watch_item),
      "}",
    ),

    _watch_item: $ => choice(
      $.setting,
      $.on_fail_action,
    ),

    on_fail_action: $ => seq(
      "on_fail",
      $._action,
    ),

    _action: $ => choice(
      $.spawn_action,
      $.identifier,
    ),

    spawn_action: $ => seq(
      "spawn",
      choice($.namespaced_job_reference, $.job_reference)),
  },
});
