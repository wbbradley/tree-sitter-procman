#include <napi.h>

typedef struct TSLanguage TSLanguage;

extern "C" TSLanguage *tree_sitter_procman();

static napi_value Init(napi_env env, napi_value exports) {
  napi_value language;
  napi_create_external(env, tree_sitter_procman(), nullptr, nullptr, &language);
  napi_set_named_property(env, exports, "language", language);

  napi_value name;
  napi_create_string_utf8(env, "procman", NAPI_AUTO_LENGTH, &name);
  napi_set_named_property(env, exports, "name", name);

  return exports;
}

NAPI_MODULE(tree_sitter_procman_binding, Init)
