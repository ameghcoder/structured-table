<script lang="ts">
  import type { SanityTable } from "structured-table";
  import TextCell from "../cell/TextCell.svelte";
  import LinkCell from "../cell/LinkCell.svelte";
  import ButtonCell from "../cell/ButtonCell.svelte";
  import "../style.css";

  let {
    data,
    className = "border",
  }: { data: SanityTable; className?: string } = $props();
</script>

<div class={`st-theme-${className}`}>
  <table>
    {#if data.header}
      <thead>
        <tr>
          {#if data.showSerialIndex}<th>#</th>{/if}
          {#each data.header.cells as cell (cell.uid)}
            <th
              colspan={cell.colSpan ?? 1}
              rowspan={cell.rowSpan ?? 1}
              style:text-align={cell.align ?? "left"}
              class={cell.class}
            >
              {#if cell.type === "text"}<TextCell data={cell} />
              {:else if cell.type === "link"}<LinkCell data={cell} />
              {:else if cell.type === "button"}<ButtonCell data={cell} />
              {/if}
            </th>
          {/each}
        </tr>
      </thead>
    {/if}

    <tbody>
      {#each data.body as row, idx (row.uid)}
        <tr>
          {#if data.showSerialIndex}<td>{idx + 1}</td>{/if}
          {#each row.cells as cell (cell.uid)}
            <svelte:element
              this={cell.cellType === "header" ? "th" : "td"}
              colspan={cell.colSpan ?? 1}
              rowspan={cell.rowSpan ?? 1}
              style:text-align={cell.align ?? "left"}
              class={cell.class}
            >
              {#if cell.type === "text"}<TextCell data={cell} />
              {:else if cell.type === "link"}<LinkCell data={cell} />
              {:else if cell.type === "button"}<ButtonCell data={cell} />
              {/if}
            </svelte:element>
          {/each}
        </tr>
      {/each}
    </tbody>

    {#if data.footer && data.footer.cells.length > 0}
      <tfoot>
        <tr>
          {#if data.showSerialIndex}<th>#</th>{/if}
          {#each data.footer.cells as cell (cell.uid)}
            <th
              colspan={cell.colSpan ?? 1}
              rowspan={cell.rowSpan ?? 1}
              style:text-align={cell.align ?? "left"}
              class={cell.class}
            >
              {#if cell.type === "text"}<TextCell data={cell} />
              {:else if cell.type === "link"}<LinkCell data={cell} />
              {:else if cell.type === "button"}<ButtonCell data={cell} />
              {/if}
            </th>
          {/each}
        </tr>
      </tfoot>
    {/if}
  </table>
</div>
