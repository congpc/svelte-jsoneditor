<svelte:options immutable={true} />

<script lang="ts">
  import { isMacDevice } from '$lib/utils/navigatorUtils.js'
  import Header from './Header.svelte'
  import Modal from './Modal.svelte'
  import { t } from '$lib/translations'

  export let onClose: () => void

  const ctrl = isMacDevice() ? '⌘' : 'Ctrl'
</script>

<Modal {onClose} className="jse-copy-paste">
  <Header title={$t('modals.copy_and_paste')} {onClose} />

  <div class="jse-modal-contents">
    <div>{$t('modals.copy_and_paste_description')}</div>

    <div class="jse-shortcuts">
      <div class="jse-shortcut">
        <div class="jse-key">
          {ctrl}+C
        </div>
        {$t('modals.for_copy')}
      </div>
      <div class="jse-shortcut">
        <div class="jse-key">
          {ctrl}+X
        </div>
        {$t('modals.for_cut')}
      </div>
      <div class="jse-shortcut">
        <div class="jse-key">
          {ctrl}+V
        </div>
        {$t('modals.for_paste')}
      </div>
    </div>

    <div class="jse-actions">
      <button type="button" class="jse-primary" on:click={onClose}> {$t('modals.close')} </button>
    </div>
  </div>
</Modal>

<style src="./CopyPasteModal.scss"></style>
