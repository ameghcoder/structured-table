export interface MetaJson {
    name: string;
    framework: string;
    dependencies: { package: string; version?: string }[];
    rendererVersion: { [key: string]: string };
    entry: { [key: string]: string };
    files: string[];
    constraints: {
        ssr: boolean;
        rscCompatible: boolean;
        requiresClientComponents: string[];
    };
}