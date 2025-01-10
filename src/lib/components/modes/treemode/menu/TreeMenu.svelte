<svelte:options immutable={true} />

<script lang="ts">
  import {
    faCopy,
    faEllipsisV,
    faFilter,
    faRedo,
    faSearch,
    faSortAmountDownAlt,
    faUndo
  } from '@fortawesome/free-solid-svg-icons'
  import { faJSONEditorCollapse, faJSONEditorExpand } from '$lib/img/customFontawesomeIcons.js'
  import { isObjectOrArray } from '$lib/utils/typeUtils.js'
  import Menu from '../../../controls/Menu.svelte'
  import type {
    HistoryItem,
    History,
    JSONSelection,
    MenuItem,
    OnRenderMenuInternal
  } from '$lib/types'
  import { isKeySelection, isMultiSelection, isValueSelection } from '$lib/logic/selection.js'
  import { t } from '$lib/translations'

  export let json: unknown
  export let selection: JSONSelection | undefined

  export let readOnly: boolean
  export let showSearch = false
  export let history: History<HistoryItem>

  export let onExpandAll: () => void
  export let onCollapseAll: () => void
  export let onUndo: () => void
  export let onRedo: () => void
  export let onSort: () => void
  export let onTransform: () => void
  export let onContextMenu: (event: MouseEvent) => void
  export let onCopy: () => void
  export let onRenderMenu: OnRenderMenuInternal

  function handleToggleSearch() {
    showSearch = !showSearch
  }

  $: hasJson = json !== undefined
  $: hasSelectionContents =
    hasJson &&
    (isMultiSelection(selection) || isKeySelection(selection) || isValueSelection(selection))

  let expandMenuItem: MenuItem
  $: expandMenuItem = {
    type: 'button',
    icon: faJSONEditorExpand,
    title: $t('modes.menu_expand_all') || 'Expand all',
    className: 'jse-expand-all',
    onClick: onExpandAll,
    disabled: !isObjectOrArray(json)
  }

  let collapseMenuItem: MenuItem
  $: collapseMenuItem = {
    type: 'button',
    icon: faJSONEditorCollapse,
    title: $t('modes.menu_collapse_all') || 'Collapse all',
    className: 'jse-collapse-all',
    onClick: onCollapseAll,
    disabled: !isObjectOrArray(json)
  }

  let searchMenuItem: MenuItem
  $: searchMenuItem = {
    type: 'button',
    icon: faSearch,
    title: $t('modes.menu_search') || 'Search (Ctrl+F)',
    className: 'jse-search',
    onClick: handleToggleSearch,
    disabled: json === undefined
  }

  let defaultItems: MenuItem[]
  $: defaultItems = !readOnly
    ? [
        expandMenuItem,
        collapseMenuItem,
        {
          type: 'separator'
        },
        {
          type: 'button',
          icon: faSortAmountDownAlt,
          title: $t('modes.menu_sort') || 'Sort',
          className: 'jse-sort',
          onClick: onSort,
          disabled: readOnly || json === undefined
        },
        {
          type: 'button',
          icon: faFilter,
          title:
            $t('modes.menu_transform_contents') || 'Transform contents (filter, sort, project)',
          className: 'jse-transform',
          onClick: onTransform,
          disabled: readOnly || json === undefined
        },
        searchMenuItem,
        {
          type: 'button',
          icon: faEllipsisV,
          title:
            $t('modes.menu_context_explanation') ||
            'Open context menu (Click here, right click on the selection, or use the context menu button or Ctrl+Q)',
          className: 'jse-contextmenu',
          onClick: onContextMenu
        },
        {
          type: 'separator'
        },
        {
          type: 'button',
          icon: faUndo,
          title: $t('modes.menu_undo') || 'Undo (Ctrl+Z)',
          className: 'jse-undo',
          onClick: onUndo,
          disabled: !history.canUndo
        },
        {
          type: 'button',
          icon: faRedo,
          title: $t('modes.menu_redo') || 'Redo (Ctrl+Shift+Z)',
          className: 'jse-redo',
          onClick: onRedo,
          disabled: !history.canRedo
        },
        {
          type: 'space'
        }
      ]
    : [
        expandMenuItem,
        collapseMenuItem,
        {
          type: 'separator'
        },
        {
          type: 'button',
          icon: faCopy,
          title: $t('modes.menu_copy') || 'Copy (Ctrl+C)',
          className: 'jse-copy',
          onClick: onCopy,
          disabled: !hasSelectionContents
        },
        {
          type: 'separator'
        },
        searchMenuItem,
        {
          type: 'space'
        }
      ]

  // eslint-disable-next-line svelte/no-unused-svelte-ignore
  // svelte-ignore reactive_declaration_non_reactive_property
  $: items = onRenderMenu(defaultItems) || defaultItems
</script>

<Menu {items} />
