import type { ContextMenuItem, DocumentState, JSONSelection } from 'svelte-jsoneditor'
import {
  faCheckSquare,
  faClone,
  faCopy,
  faCut,
  faPaste,
  faPen,
  faPlus,
  faSquare,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import { isKeySelection, isMultiSelection, isValueSelection } from '$lib/logic/selection'
import { getIn } from 'immutable-json-patch'
import { getFocusPath, singleItemSelected } from '$lib/logic/selection'
import { isObjectOrArray } from '$lib/utils/typeUtils'
import { getEnforceString } from '$lib/logic/documentState'
import { get } from 'svelte/store'
import { t } from '$lib/translations'

export default function ({
  json,
  documentState,
  selection,
  readOnly,
  onEditValue,
  onEditRow,
  onToggleEnforceString,
  onCut,
  onCopy,
  onPaste,
  onRemove,
  onDuplicateRow,
  onInsertBeforeRow,
  onInsertAfterRow,
  onRemoveRow
}: {
  json: unknown | undefined
  documentState: DocumentState | undefined
  selection: JSONSelection | undefined
  readOnly: boolean
  onEditValue: () => void
  onEditRow: () => void
  onToggleEnforceString: () => void
  onCut: (indent: boolean) => void
  onCopy: (indent: boolean) => void
  onPaste: () => void
  onRemove: () => void
  onDuplicateRow: () => void
  onInsertBeforeRow: () => void
  onInsertAfterRow: () => void
  onRemoveRow: () => void
}): ContextMenuItem[] {
  const hasJson = json !== undefined
  const hasSelection = !!selection
  const focusValue =
    json !== undefined && selection ? getIn(json, getFocusPath(selection)) : undefined

  const hasSelectionContents =
    hasJson &&
    (isMultiSelection(selection) || isKeySelection(selection) || isValueSelection(selection))

  const canEditValue =
    !readOnly && hasJson && selection !== undefined && singleItemSelected(selection)
  const canEnforceString = canEditValue && !isObjectOrArray(focusValue)

  const canCut = !readOnly && hasSelectionContents

  const enforceString =
    selection !== undefined ? getEnforceString(json, documentState, getFocusPath(selection)) : false

  return [
    { type: 'separator' },
    {
      type: 'row',
      items: [
        {
          type: 'column',
          items: [
            { type: 'label', text: get(t)('modes.table_table_cell') },
            {
              type: 'dropdown-button',
              main: {
                type: 'button',
                onClick: () => onEditValue(),
                icon: faPen,
                text: get(t)('modes.edit'),
                title: get(t)('modes.edit_title'),
                disabled: !canEditValue
              },
              width: '11em',
              items: [
                {
                  type: 'button',
                  icon: faPen,
                  text: get(t)('modes.edit'),
                  title: get(t)('modes.edit_title'),
                  onClick: () => onEditValue(),
                  disabled: !canEditValue
                },
                {
                  type: 'button',
                  icon: enforceString ? faCheckSquare : faSquare,
                  text: get(t)('modes.enforce_string_text'),
                  title: get(t)('modes.enforce_string_title'),
                  onClick: () => onToggleEnforceString(),
                  disabled: !canEnforceString
                }
              ]
            },
            {
              type: 'dropdown-button',
              main: {
                type: 'button',
                onClick: () => onCut(true),
                icon: faCut,
                text: get(t)('modes.cut_text'),
                title: get(t)('modes.cut_formatted_title'),
                disabled: !canCut
              },
              width: '10em',
              items: [
                {
                  type: 'button',
                  icon: faCut,
                  text: get(t)('modes.cut_formatted_text'),
                  title: get(t)('modes.cut_formatted_title'),
                  onClick: () => onCut(true),
                  disabled: readOnly || !hasSelectionContents
                },
                {
                  type: 'button',
                  icon: faCut,
                  text: get(t)('modes.cut_compacted_text'),
                  title: get(t)('modes.cut_compacted_title'),
                  onClick: () => onCut(false),
                  disabled: readOnly || !hasSelectionContents
                }
              ]
            },
            {
              type: 'dropdown-button',
              main: {
                type: 'button',
                onClick: () => onCopy(true),
                icon: faCopy,
                text: get(t)('modes.copy_text'),
                title: get(t)('modes.copy_formatted_title'),
                disabled: !hasSelectionContents
              },
              width: '12em',
              items: [
                {
                  type: 'button',
                  icon: faCopy,
                  text: get(t)('modes.copy_formatted_text'),
                  title: get(t)('modes.copy_formatted_title'),
                  onClick: () => onCopy(false),
                  disabled: !hasSelectionContents
                },
                {
                  type: 'button',
                  icon: faCopy,
                  text: get(t)('modes.copy_compacted_text'),
                  title: get(t)('modes.copy_compacted_title'),
                  onClick: () => onCopy(false),
                  disabled: !hasSelectionContents
                }
              ]
            },
            {
              type: 'button',
              onClick: () => onPaste(),
              icon: faPaste,
              text: get(t)('modes.paste_text'),
              title: get(t)('modes.paste_title'),
              disabled: readOnly || !hasSelection
            },
            {
              type: 'button',
              onClick: () => onRemove(),
              icon: faTrashCan,
              text: get(t)('modes.remove_text'),
              title: get(t)('modes.remove_title'),
              disabled: readOnly || !hasSelectionContents
            }
          ]
        },
        {
          type: 'column',
          items: [
            { type: 'label', text: get(t)('modes.table_table_row') },
            {
              type: 'button',
              onClick: () => onEditRow(),
              icon: faPen,
              text: get(t)('modes.edit_row'),
              title: get(t)('modes.edit_row_title'),
              disabled: readOnly || !hasSelection || !hasJson
            },
            {
              type: 'button',
              onClick: () => onDuplicateRow(),
              icon: faClone,
              text: get(t)('modes.duplicate_row'),
              title: get(t)('modes.duplicate_row_title'),
              disabled: readOnly || !hasSelection || !hasJson
            },
            {
              type: 'button',
              onClick: () => onInsertBeforeRow(),
              icon: faPlus,
              text: get(t)('modes.insert_before'),
              title: get(t)('modes.menu_table_insert_before_title'),
              disabled: readOnly || !hasSelection || !hasJson
            },
            {
              type: 'button',
              onClick: () => onInsertAfterRow(),
              icon: faPlus,
              text: get(t)('modes.insert_after'),
              title: get(t)('modes.menu_table_insert_after_title'),
              disabled: readOnly || !hasSelection || !hasJson
            },
            {
              type: 'button',
              onClick: () => onRemoveRow(),
              icon: faTrashCan,
              text: get(t)('modes.remove_row'),
              title: get(t)('modes.remove_row_title'),
              disabled: readOnly || !hasSelection || !hasJson
            }
          ]
        }
      ]
    }
  ]
}
