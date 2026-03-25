# Neovim Integration

Add the following to `~/.config/nvim/init.lua`, after the `nvim-treesitter.configs` setup block:

```lua
-- Register tree-sitter-procman parser for .pman files
vim.filetype.add({ extension = { pman = "pman" } })
vim.treesitter.language.add("procman", {
  path = "/Users/wbbradley/src/tree-sitter-procman/procman.dylib",
  filetype = "pman",
})
```

- `vim.filetype.add` ensures nvim recognizes `.pman` files (vim-procman may already do this via ftdetect, but this guarantees it)
- The first arg to `language.add` must be `"procman"` to match the symbol `tree_sitter_procman` in the dylib
- `filetype = "pman"` maps the `pman` filetype to the `procman` parser

## Making queries available to nvim

The queries directory needs to be findable by nvim. Two options:

### Option A — symlink into nvim runtime

```bash
mkdir -p ~/.config/nvim/queries/procman
ln -s ~/src/tree-sitter-procman/queries/highlights.scm ~/.config/nvim/queries/procman/highlights.scm
ln -s ~/src/tree-sitter-procman/queries/indents.scm ~/.config/nvim/queries/procman/indents.scm
ln -s ~/src/tree-sitter-procman/queries/locals.scm ~/.config/nvim/queries/procman/locals.scm
```

### Option B — add to runtimepath

Add this line before the `language.add` call:

```lua
vim.opt.runtimepath:append("/Users/wbbradley/src/tree-sitter-procman")
```

## Verification

Open any `.pman` file and run `:InspectTree` to see the parse tree.
