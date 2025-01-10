<svelte:options immutable={true} />

<script lang="ts">
  import { t } from '$lib/translations'

  export let readOnly: boolean
  export let onCreateArray: () => void
  export let onCreateObject: () => void
  export let onClick: () => void
</script>

<div class="jse-welcome" on:click={() => onClick()} role="none">
  <div class="jse-space jse-before"></div>
  <div class="jse-contents">
    <div class="jse-welcome-title">{$t('modes.tree_welcome_title')}</div>
    {#if !readOnly}
      <div class="jse-welcome-info">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html $t('modes.tree_welcome_info')}
      </div>
      <button
        title={$t('modes.true_button_object')}
        on:click|stopPropagation={() => onCreateObject()}>{$t('modes.tree_create_object')}</button
      >
      <button title={$t('modes.true_button_array')} on:click|stopPropagation={() => onCreateArray()}
        >{$t('modes.tree_create_array')}</button
      >
    {/if}
  </div>
  <div class="jse-space jse-after"></div>
</div>

<style src="./Welcome.scss"></style>
