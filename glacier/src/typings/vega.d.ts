declare module "vega" {
    export interface VegaChartConstructor {
        (args: {renderer: 'canvas'}): VegaCanvasRenderer;
        (args: {renderer: 'svg'}): VegaSvgRenderer;
        (args: any): VegaRenderer;
    }
    export interface VegaRenderer {
        update(): this;
    }
    export interface VegaCanvasRenderer extends VegaRenderer {
        canvas(): any;
    }
    export interface VegaSvgRenderer extends VegaRenderer {
        svg(): string;
    }
    export namespace parse {
        export function spec(spec: any,  callback: (chart: VegaChartConstructor) => void)
    }
}