export type RendererKind = "react" | "vue";

type RendererMap = {
  react?: unknown;
  vue?: unknown;
};

const renderers: RendererMap = {};

export function registerRenderer<T>(kind: RendererKind, renderer: T) {
  renderers[kind] = renderer;
}

export function getRenderer<T>(kind: RendererKind): T {
  const renderer = renderers[kind];
  if (!renderer) {
    throw new Error(
      `STL ${kind} renderer not registered. Run stl-cli add ${kind}.`
    );
  }
  return renderer as T;
}
