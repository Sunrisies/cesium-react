import { Viewer } from 'cesium';
import { CesiumPlugin, PluginConfig, PluginsMap } from './base';
import { ClickHandlerPlugin } from './clickHandler';
import { DrawLinePlugin } from './drawLine';

export const builtinPlugins = {
    ClickHandler: ClickHandlerPlugin,
    DrawLine: DrawLinePlugin
};

export function installPlugins<T extends keyof PluginsMap>(
    viewer: Viewer,
    plugins: Array<PluginConfig<T>> = []
) {
    const cleaners: (() => void)[] = [];

    plugins.forEach(({ name, options, enabled = true }) => {
        if (!enabled) return;

        const PluginClass = builtinPlugins[name];
        if (!PluginClass) return;

        const instance = new PluginClass();
        const cleaner = instance.install(viewer, options);
        cleaners.push(cleaner);
    });

    return () => cleaners.forEach(clean => clean());
}