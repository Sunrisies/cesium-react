import { Viewer, ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian2, defined, Cartographic, Math } from 'cesium';
import { CesiumPlugin, PluginsMap } from './base';

export class ClickHandlerPlugin implements CesiumPlugin<PluginsMap['ClickHandler']> {
    private handler?: ScreenSpaceEventHandler;

    install(viewer: Viewer, config?: PluginsMap['ClickHandler']) {
        // 初始化事件处理器
        this.handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

        // 左键点击处理
        this.handler.setInputAction((event: ScreenSpaceEventHandler.PositionedEvent) => {
            const { Lon, Lat } = getLonLat(viewer, event.position)!
            // 查看当前点是不是有实体
            const pickedObject = viewer.scene.pick(event.position)
            if (pickedObject && defined(pickedObject.id)) {
                // 点击的是实体
                console.log(pickedObject, '点击到实体了')
                config?.onLeftClick?.(
                    { x: event.position.x, y: event.position.y, Lat, Lon },
                    pickedObject
                );
                // callback({ event, Lon, Lat, entity: pickedObject })
                return
            }
            config?.onLeftClick?.(
                { x: event.position.x, y: event.position.y, Lat, Lon },
            );
        }, ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction((event: ScreenSpaceEventHandler.PositionedEvent) => {
            const { Lon, Lat } = getLonLat(viewer, event.position)!
            // 查看当前点是不是有实体
            const pickedObject = viewer.scene.pick(event.position)
            if (pickedObject && defined(pickedObject.id)) {
                // 点击的是实体
                console.log(pickedObject, '点击到实体了')
                config?.onLeftClick?.(
                    { x: event.position.x, y: event.position.y, Lat, Lon },
                    pickedObject
                );
                // callback({ event, Lon, Lat, entity: pickedObject })
                return
            }
            config?.onLeftClick?.(
                { x: event.position.x, y: event.position.y, Lat, Lon },
            );
        }, ScreenSpaceEventType.RIGHT_CLICK);

        // 返回清理函数
        return () => {
            this.handler?.destroy();
            this.handler = undefined;
        };
    }
}
/**
 * 计算屏幕坐标对应的经纬度
 * @param {Cesium.Viewer} viewer - Cesium 地图查看器实例。
 * @param {Cesium.Cartesian2} position - 屏幕坐标
 * @returns {{Lon: number, Lat: number}} - 经纬度
 */
export const getLonLat = (viewer: Viewer, position: Cartesian2): { Lon: number; Lat: number } | null => {
    const ray = viewer.camera.getPickRay(position)!
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    if (defined(cartesian)) {
        const cartographic = Cartographic.fromCartesian(cartesian)
        const Lon = Math.toDegrees(cartographic.longitude)
        const Lat = Math.toDegrees(cartographic.latitude)
        return { Lon, Lat }
    } else {
        return null
    }
}