import { TypographyBlockCode, TypographyH1, TypographyH2, TypographyH3, TypographyLarge, TypographyList, TypographyP } from "@/components/ui/typography";

export default function ButtonsPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <TypographyH1 >Buttons</TypographyH1>
            <p className="leading-7 not-first:mt-6">
                Buttons in STL make your tables interactive. They are defined using the `[button]` token.
            </p>

            <TypographyH2 className="mt-6" >Syntax</TypographyH2>
            <TypographyBlockCode lang="STL">
                {`[button text="Label" action="action_name" targetId="id_value"]`}
            </TypographyBlockCode>

            <TypographyH3 className="mt-8">Attributes</TypographyH3>
            <TypographyList list={[
                '`text`: The label displayed on the button.',
                '`url`(optional): if you pass a url it redirects to that url',
                "`action`(optional): A string identifier for the action (e.g., 'edit', 'delete')",
                '`targetId`(optional): Associated ID for the action (e.g., product ID), this will be added as <button id="your-id" ... />',
                "`variant`(default: 'default'): 'default', 'outline', 'ghost' (depends on theme support)."
            ]} />

            <TypographyLarge className="border-b mt-10">Example</TypographyLarge>
            <TypographyBlockCode lang="STL">
                {`#table
cols: 3

[header]
Item | Price | Actions

[body]
MacBook Pro | $1999 | [button text="Buy Now" action="cart_add" targetId="mac_pro"]
iPad Air    | $599  | [button text="Buy Now" action="cart_add" targetId="ipad_air"]
...`}
            </TypographyBlockCode>

            <TypographyH2 >Handling Clicks</TypographyH2>
            <TypographyP>
                The Structured Table Library handles button interactions in two ways:
            </TypographyP>

            <TypographyList list={[
                <p key='url-navigation'><strong className="text-primary">URL Navigation</strong>: If a `url` attribute is present, the button will open the URL in a new tab.</p>,
                <p key='custom-actions'><strong className="text-primary">Custom Actions</strong>: If an `action` attribute is present, a custom event named `st-action` is dispatched. You can listen for this event in your application.</p>,
            ]} />

            <TypographyH3 className="mt-6">Listening for Actions</TypographyH3>
            <TypographyP>
                To handle custom actions like &apos;edit&apos; or &apos;delete&apos;, add an event listener for `st-action`. The event details will contain the action name, target ID, and button text.
            </TypographyP>

            <TypographyBlockCode lang="tsx">
                {`useEffect(() => {
    const handleTableAction = (e: any) => {
        const { action, targetId, text } = e.detail;
        
        console.log(\`Action triggered: \${action} on ID: \${targetId}\`);
        
        switch (action) {
            case 'edit':
                // Open edit modal for targetId
                break;
            case 'delete':
                // Confirm deletion for targetId
                break;
        }
    };

    // Add listener to window or specific container
    window.addEventListener('st-action', handleTableAction);
    
    return () => {
        window.removeEventListener('st-action', handleTableAction);
    };
}, []);`}
            </TypographyBlockCode>

        </div>
    )
}
