<svelte:options immutable={true} />

<script lang="ts">
  import type { JSONPath } from 'immutable-json-patch'
  import { getIn, isJSONArray, isJSONObject } from 'immutable-json-patch'
  import type { JSONParser, OnChangeMode } from '$lib/types.js'
  import { Mode } from '$lib/types.js'
  import { valueType } from '$lib/utils/typeUtils.js'
  import { findNestedArrays } from '$lib/logic/table.js'
  import { isEmpty } from 'lodash-es'
  import { stringifyJSONPath } from '$lib/utils/pathUtils.js'
  import { t } from '$lib/translations'

  export let text: string | undefined
  export let json: unknown | undefined
  export let readOnly: boolean
  export let parser: JSONParser
  export let openJSONEditorModal: (path: JSONPath) => void
  export let onChangeMode: OnChangeMode
  export let onClick: () => void

  $: action = readOnly ? $t('modes.view') : $t('modes.edit')

  let nestedArrayPaths: JSONPath[]
  $: nestedArrayPaths = json
    ? findNestedArrays(json)
        .slice(0, 99)
        .filter((path) => path.length > 0)
    : []
  $: hasNestedArrays = !isEmpty(nestedArrayPaths)
  $: isEmptyDocument = json === undefined && (text === '' || text === undefined)

  function countItems(nestedArrayPath: JSONPath): number {
    return (getIn(json, nestedArrayPath) as JSONPath).length
  }

  function getDocumentTypeString(): string {
    return hasNestedArrays
      ? $t('modes.table_title_object_nested_array')
      : isEmptyDocument
        ? $t('modes.table_title_empty_document')
        : isJSONObject(json)
          ? $t('modes.table_title_object')
          : isJSONArray(json)
            ? $t('modes.table_title_empty_array') // note: can also be an array with objects but without properties
            : `A ${valueType(json, parser)}`
  }
</script>

<div class="jse-table-mode-welcome" on:click={() => onClick()} role="none">
  <div class="jse-space jse-before"></div>

  <div class="jse-nested-arrays">
    <div class="jse-nested-arrays-title">{getDocumentTypeString()}</div>
    <div class="jse-nested-arrays-info">
      {#if hasNestedArrays}
        {$t('modes.table_nested_array_info1')}
      {:else}
        {getDocumentTypeString()} {$t('modes.table_nested_array_info2')}
      {/if}
      {#if isEmptyDocument && !readOnly}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html $t('modes.table_nested_array_info3')}
      {:else}
        {$t('modes.table_nested_array_info4')}
      {/if}
    </div>
    {#each nestedArrayPaths as nestedArrayPath}
      {@const count = countItems(nestedArrayPath)}

      <button
        type="button"
        class="jse-nested-array-action"
        on:click={() => openJSONEditorModal(nestedArrayPath)}
      >
        {action} "{stringifyJSONPath(nestedArrayPath)}"
        <span class="jse-nested-array-count">({count} {count !== 1 ? 'items' : 'item'})</span>
      </button>
    {/each}
    <button type="button" class="jse-nested-array-action" on:click={() => onChangeMode(Mode.tree)}>
      {action}
      {$t('modes.table_nested_array_info5')}
    </button>
  </div>

  <div class="jse-space jse-after"></div>
</div>

<style src="./TableModeWelcome.scss"></style>
