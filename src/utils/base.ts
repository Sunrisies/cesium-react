import { Cartesian3, Color, Viewer } from "cesium";
import { DrawLineConfig } from "./drawLine";

export interface CesiumPlugin<Options = any> {
    install(viewer: Viewer, config?: Options): () => void;
}
// 定义插件映射类型
export type PluginsMap = {
    ClickHandler: {
        onLeftClick?: (position: { x: number; y: number, Lat: number, Lon: number }, pickedObjects?: any[]) => void
        onRightClick?: (position: { x: number; y: number, Lat: number, Lon: number }, pickedObjects?: any[]) => void
    };
    DrawLine: {
        strokeColor?: Color
        strokeWidth?: number
        onDrawEnd?: (positions: Cartesian3[]) => void
        startDrawing?: (viewer: Viewer, position: any, config?: DrawLineConfig) => void
        deleteDrawing?: (viewer: Viewer, tempEntity: any, finishedLines: any[]) => void
        // onDrawEnd?: (position: { x: number; y: number, Lat: number, Lon: number }) => void
    }
};
export type PluginConfig<K extends keyof PluginsMap = keyof PluginsMap> = {
    name: K;
    options?: PluginsMap[K];
    enabled?: boolean;
};