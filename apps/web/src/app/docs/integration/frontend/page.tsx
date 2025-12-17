import { TypographyH1, TypographyH2, TypographyH3, TypographyP, TypographyList, TypographyBlockCode, TypographyInlineCode, TypographyLink, TypographyMuted } from "@/components/ui/typography"
import Link from "next/link"

export default function FrontendIntegrationPage() {
    return (
        <div className="max-w-none">
            <TypographyH1>Frontend Integration</TypographyH1>
            <TypographyP>
                Once you have data in Sanity (or any other source) in the STL format, you need to render it.
            </TypographyP>

            <TypographyH2 className="mt-10">1. Install Dependencies</TypographyH2>
            <TypographyP>
                Install the core package and the CLI, then generate the React components.
            </TypographyP>
            <TypographyBlockCode lang="cmd">
                npm install structured-table structured-table-cli && npx stl-cli add react
            </TypographyBlockCode>

            <TypographyH2 className="mt-10">2. Include CSS</TypographyH2>
            <TypographyP>
                Import the base styles in your <TypographyInlineCode>layout.tsx</TypographyInlineCode> or <TypographyInlineCode>_app.tsx</TypographyInlineCode> or <TypographyInlineCode>global.css</TypographyInlineCode>.
            </TypographyP>
            <TypographyP>
                You can copy the CSS code from our <Link href="/themes">Themes in CSS</Link> page. And either create new CSS file or add it to your global.css or any existing CSS file.
            </TypographyP>
            <TypographyP>
                You can change the className based on your theme or custom CSS code. Read more about this <TypographyLink href="/themes" className="text-primary">here</TypographyLink>.
            </TypographyP>
            <TypographyBlockCode>
                {`// Render the table
return <STLReact.Table data={parsedSTL} className='border' />`}
            </TypographyBlockCode>

            <TypographyH2 className="mt-10">3. Usage in Portable Text</TypographyH2>
            <TypographyP>
                Use the generated components within your Portable Text configuration. Here is an example of how to implement the <TypographyInlineCode>stlTableBlock</TypographyInlineCode>.
            </TypographyP>

            <TypographyBlockCode lang="typescript">
                {`import * as STLReact from './components/react' // Path to your generated components
import { STL } from 'structured-table'

const myPortableTextComponents = {
  types: {
    stlTableBlock: ({ value }: {
      value: {
        _key: string;
        _type: string;
        stlString: string;
      }
    }) => {
      // Parse the STL string
      const parsedSTL = STL.parse(value.stlString);
      
      // Render the table
      return <STLReact.Table data={parsedSTL} className='border' />
    }
  }
}

// Usage in your PortableText component
// <PortableText value={data.body} components={myPortableTextComponents} />`}
            </TypographyBlockCode>

            <TypographyH2 className="mt-10">4. Create Table in STL Language</TypographyH2>
            <TypographyP>
                You can use our interactive live table editor at <TypographyLink href="/playground">/playground</TypographyLink> where you can create your entire table and then export that in the STL format.
            </TypographyP>

            <TypographyH2 className="mt-10">5. Theming</TypographyH2>
            <TypographyP>
                The <TypographyInlineCode>className</TypographyInlineCode> prop allows you to switch between bundled themes. But before using the following theme, you need to download or copy the CSS code for specific theme from our <TypographyLink href="/themes" className="text-primary">Themes in CSS</TypographyLink> page.
            </TypographyP>
            <TypographyList list={[
                <span key="1"><TypographyInlineCode>basic</TypographyInlineCode> (default)</span>,
                <span key="2"><TypographyInlineCode>simple</TypographyInlineCode></span>,
                <span key="3"><TypographyInlineCode>border</TypographyInlineCode></span>,
                <span key="4"><TypographyInlineCode>stripe</TypographyInlineCode></span>,
                <span key="5"><TypographyInlineCode>shadcn</TypographyInlineCode></span>
            ]} />
            <TypographyP>
                You can also pass your own custom class name and override CSS variables to create a unique look.
            </TypographyP>
        </div>
    )
}
