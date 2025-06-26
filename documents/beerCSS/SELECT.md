# Select

Selects display a list of choices on temporary surfaces.

## Element

```html
<div class="field">
  <select>...</select>
</div>
```

## Most used helpers

**Forms**

label, border, round, fill, prefix, suffix

**Sizes**

small, medium, large, extra

**Triggers**

active

## Example

```html
<div class="field label border">
  <select>
    <option>Item</option>
    <option>Item</option>
    <option>Item</option>
  </select>
  <label>Label</label>
</div>
```

## Triggers

### To up/down a label

#### Method 1

Add/remove `active` class on label/select (the JS file of beer do this automatically).

```html
<div class="field label">
  <select>
    <option>Item</option>
    <option>Item</option>
    <option>Item</option>
  </select>
  <label class="active">Label</label>
</div>

<div class="field label border">
  <select class="active">
    <option>Item</option>
    <option>Item</option>
    <option>Item</option>
  </select>
  <label class="active">Label</label>
</div>
```

## Go to

[Begin](INDEX.md), [Elements](ELEMENTS.md), [Helpers](HELPERS.md), [Settings](SETTINGS.md), [Summary](SUMMARY.md), [Javascript](JAVASCRIPT.md), [beercss.com](https://www.beercss.com)

[Badge](BADGE.md), [Button](BUTTON.md), [Card](CARD.md), [Checkbox](CHECKBOX.md), [Chip](CHIP.md), [Container](CONTAINER.md), [Dialog](DIALOG.md), [Divider](DIVIDER.md), [Expansion](EXPANSION.md), [Grid](GRID.md), [Icon](ICON.md), [Input](INPUT.md), [Layout](LAYOUT.md), [List](LIST.md), [Main layout](MAIN_LAYOUT.md), [Media](MEDIA.md), [Menu](MENU.md), [Navigation](NAVIGATION.md), [Overlay](OVERLAY.md), [Page](PAGE.md), [Progress](PROGRESS.md), [Radio](RADIO.md), [Select](SELECT.md), [Slider](SLIDER.md), [Switch](SWITCH.md), [Table](TABLE.md), [Tabs](TABS.md), [Textarea](TEXTAREA.md), [Snackbar](SNACKBAR.md), [Tooltip](TOOLTIP.md), [Typography](TYPOGRAPHY.md)
