; Scopes
(import_definition) @local.scope
(job_definition) @local.scope
(service_definition) @local.scope
(event_definition) @local.scope
(for_statement) @local.scope

; Definitions
(for_statement
  variable: (identifier) @local.definition)

(arg_definition
  name: (identifier) @local.definition)
