<script lang="ts">
  import type { EditorState, Line } from '@codemirror/state'
  import { t } from '$lib/translations'

  export let editorState: EditorState | undefined

  let pos: number | undefined
  $: pos = editorState?.selection?.main?.head

  let line: Line | undefined
  $: line = pos !== undefined ? editorState?.doc?.lineAt(pos) : undefined

  let lineNumber: number | undefined
  $: lineNumber = line !== undefined ? line.number : undefined

  let columnNumber: number | undefined
  $: columnNumber = line !== undefined && pos !== undefined ? pos - line.from + 1 : undefined

  let charCount: number | undefined
  $: charCount = editorState?.selection?.ranges?.reduce((count, range) => {
    return count + range.to - range.from
  }, 0)
</script>

<div class="jse-status-bar">
  {#if lineNumber !== undefined}
    <div class="jse-status-bar-info">{$t('modes.statusbar_line', { default: lineNumber })}</div>
  {/if}

  {#if columnNumber !== undefined}
    <div class="jse-status-bar-info">{$t('modes.statusbar_column', { default: columnNumber })}</div>
  {/if}

  {#if charCount !== undefined && charCount > 0}
    <div class="jse-status-bar-info">{$t('modes.statusbar_selection', { default: charCount })}</div>
  {/if}
</div>

<style src="./StatusBar.scss"></style>
