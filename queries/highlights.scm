; ── Keywords ───────────────────────────────────────────────────────────

[
  "config"
  "job"
  "task"
  "service"
  "event"
] @keyword.type

[
  "if"
] @keyword.conditional

[
  "for"
  "in"
] @keyword.repeat

[
  "env"
  "run"
  "wait"
  "watch"
  "arg"
  "after"
  "http"
  "connect"
  "exists"
  "running"
  "contains"
  "glob"
  "spawn"
  "on_fail"
  "args"
  "import"
  "as"
] @keyword

; ── Literals ──────────────────────────────────────────────────────────

(string) @string
(string_content) @string
(escape_sequence) @string.escape
(fenced_string) @string

(number) @number
(duration) @number

(boolean) @boolean
(none) @constant.builtin

; ── References ────────────────────────────────────────────────────────

(job_reference
  "@" @punctuation.special
  (identifier) @type)

(job_output_reference
  "@" @punctuation.special
  . (identifier) @type
  "." @punctuation.delimiter
  (identifier) @property)

(args_reference
  "args" @keyword
  "." @punctuation.delimiter
  (identifier) @variable)

(namespaced_job_reference
  "@" @punctuation.special
  . (identifier) @module
  "::" @punctuation.delimiter
  (identifier) @type)

(namespaced_job_output_reference
  "@" @punctuation.special
  . (identifier) @module
  "::" @punctuation.delimiter
  (identifier) @type
  "." @punctuation.delimiter
  (identifier) @property)

(namespaced_args_reference
  (identifier) @module
  "::" @punctuation.delimiter
  "args" @keyword
  "." @punctuation.delimiter
  (identifier) @variable)

; ── Definitions ───────────────────────────────────────────────────────

(job_definition
  name: (identifier) @type.definition)

(task_definition
  name: (identifier) @type.definition)

(service_definition
  name: (identifier) @type.definition)

(event_definition
  name: (identifier) @type.definition)

(arg_definition
  name: (identifier) @variable.parameter)

(import_definition
  path: (string) @string
  alias: (identifier) @type.definition)

(import_binding
  name: (identifier) @property)

(watch_block
  name: (identifier) @label)

; ── Env bindings ──────────────────────────────────────────────────────

(env_single
  name: (identifier) @constant)

(env_pair
  name: (identifier) @constant)

; ── Settings (field names) ────────────────────────────────────────────

(setting
  name: (identifier) @property)

; ── For loop ──────────────────────────────────────────────────────────

(for_statement
  variable: (identifier) @variable)

; ── on_fail actions ───────────────────────────────────────────────────

(on_fail_action
  (identifier) @keyword)

(spawn_action
  (job_reference
    (identifier) @type))

; ── Operators ─────────────────────────────────────────────────────────

[
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "&&"
  "||"
  "!"
] @operator

[
  "="
  ".."
  "..="
] @operator

; ── Punctuation ───────────────────────────────────────────────────────

["{" "}"] @punctuation.bracket
["(" ")"] @punctuation.bracket
["[" "]"] @punctuation.bracket
"," @punctuation.delimiter
"::" @punctuation.delimiter
"@" @punctuation.special

; ── Comments ──────────────────────────────────────────────────────────

(comment) @comment
