import { TypographyH1, TypographyH2, TypographyH3, TypographyP, TypographyBlockCode, TypographyInlineCode, TypographyLink, TypographyMuted } from "@/components/ui/typography"

export default function SanityStudioIntegrationPage() {
  return (
    <div className="max-w-none">
      <TypographyH1>Sanity Studio Integration</TypographyH1>
      <TypographyP>
        Integrating <span className="font-bold">Structured Table</span> into Sanity Studio empowers content editors with a powerful, spreadsheet-like interface for managing tables, including advanced attribute options.
      </TypographyP>

      <TypographyH2 className="mt-10">1. Install the Plugin</TypographyH2>
      <TypographyBlockCode lang="cmd">
        npm install sanity-plugin-stl-table
      </TypographyBlockCode>
      <TypographyMuted>
        *Note: This plugin requires <TypographyInlineCode>react</TypographyInlineCode> &gt;= 18 and <TypographyInlineCode>sanity</TypographyInlineCode> &gt;= 3.0.0.*
      </TypographyMuted>

      <TypographyH2 className="mt-10">2. Setup Table Render Components</TypographyH2>
      <TypographyP>
        To enable the interactive table preview within Sanity Studio, you need to install the CLI and generate the React components.
      </TypographyP>
      <TypographyBlockCode lang="cmd">
        npm install structured-table-cli
      </TypographyBlockCode>
      <TypographyP>
        Then, run the following command to download the pre-built React table components:
      </TypographyP>
      <TypographyBlockCode lang="cmd">
        npx stl-cli add react
      </TypographyBlockCode>
      <TypographyMuted>
        Optionally, you can specify a custom path: <TypographyInlineCode>npx stl-cli add react --path ./schemaTypes/components</TypographyInlineCode>
      </TypographyMuted>

      <TypographyH2 className="mt-10">3. Register Components in Sanity Config</TypographyH2>
      <TypographyP>
        After generating the components, you must register them in your <TypographyInlineCode>sanity.config.ts</TypographyInlineCode>.
      </TypographyP>
      <TypographyBlockCode lang="typescript">
        {`// sanity.config.ts
import './schemaTypes/components/register' // Base path depends on where you installed it
import { defineConfig } from 'sanity'

export default defineConfig({
  // ... configuration
})`}
      </TypographyBlockCode>

      <TypographyH2 className="mt-10">4. Register the Schema</TypographyH2>
      <TypographyP>
        Import the <TypographyInlineCode>stlTableBlock</TypographyInlineCode> schema definition and add it to your Sanity Studio configuration <TypographyInlineCode>types</TypographyInlineCode> array.
      </TypographyP>
      <TypographyBlockCode lang="typescript">
        {`// sanity.config.ts
import { defineConfig } from 'sanity'
import { stlTableBlock } from 'sanity-plugin-stl-table'

export default defineConfig({
  // ...
  schema: {
    types: [
      // ... other types
      stlTableBlock,
    ],
  },
})`}
      </TypographyBlockCode>

      <TypographyH2 className="mt-10">5. Usage</TypographyH2>
      <TypographyP>
        You can now use the <TypographyInlineCode>stlTableBlock</TypographyInlineCode> type in your portable text editors or as a standalone field in your documents.
      </TypographyP>

      <TypographyH3 className="mt-8">In Portable Text</TypographyH3>
      <TypographyBlockCode lang="typescript">
        {`// schemas/blockContent.ts
export default {
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    { type: 'block' },
    // Add the table block
    { type: 'stlTableBlock' },
  ],
}`}
      </TypographyBlockCode>

      <TypographyH3 className="mt-8">As a Field</TypographyH3>
      <TypographyBlockCode lang="typescript">
        {`export default {
  name: 'productSpecification',
  title: 'Product Specification',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'specsTable',
      title: 'Specifications Table',
      type: 'stlTableBlock',
    },
  ],
}`}
      </TypographyBlockCode>

      <TypographyH2 className="mt-10">6. Studio Usage</TypographyH2>
      <TypographyP>
        Restart your Sanity dev server. You will now see an input field where you can paste or write your <TypographyInlineCode>STL</TypographyInlineCode> code.
      </TypographyP>
      <TypographyP>
        The table preview will update automatically below user input as you type, giving you immediate response on your table structure and content.
      </TypographyP>
      <TypographyP>
        If you need a visual editor to create complex tables, you can use our <TypographyLink href="/playground" className="text-primary">Live Table Editor</TypographyLink> to build your table primarily and then export the STL code to paste into Sanity.
      </TypographyP>

      <TypographyH2 className="mt-10">7. Create Table in STL Language</TypographyH2>
      <TypographyP>
        You can use our interactive live table editor at <TypographyLink href="/playground" className="text-primary">/playground</TypographyLink> where you can create your entire table and then export that in the STL format.
      </TypographyP>
    </div>
  )
}
