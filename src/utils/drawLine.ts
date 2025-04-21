import { Viewer, ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian3, Color, CallbackProperty } from 'cesium';
import { CesiumPlugin, PluginsMap } from './base';

export type DrawLineConfig = {
    strokeColor?: Color
    strokeWidth?: number
    onDrawEnd?: (positions: Cartesian3[]) => void
}

export class DrawLinePlugin implements CesiumPlugin<PluginsMap['DrawLine']> {
    private handler?: ScreenSpaceEventHandler;
    private isDrawing = false;
    private tempPoints: Cartesian3[] = [];
    private tempEntity: any;
    // 新增保存所有航线的数组
    private finishedLines: Array<{ entity: any; points: Cartesian3[] }> = [];
    install(viewer: Viewer, config?: PluginsMap['DrawLine']) {
        this.handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

        // 新增 ESC 键支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isDrawing) {
                this.cancelDrawing(viewer);
                config?.deleteDrawing?.(viewer, this.tempEntity, this.finishedLines);
            }
        });

        // 左键开始/添加点
        this.handler.setInputAction(({ position }: ScreenSpaceEventHandler.PositionedEvent) => {
            if (!this.isDrawing) {
                console.log('开始绘制');
                this.startDrawing(viewer, position, config);
                this.addPoint(viewer, position);

            } else {
                console.log('添加点');
                this.addPoint(viewer, position);
            }
        }, ScreenSpaceEventType.LEFT_CLICK);

        // 右键结束绘制
        this.handler.setInputAction(() => {
            if (this.isDrawing) {
                console.log('结束绘制');
                this.finishDrawing(viewer, config);
            }
        }, ScreenSpaceEventType.RIGHT_CLICK);



        return () => {
            this.handler?.destroy();
            this.cleanTempData(viewer);
            // 新增清理所有航线
            this.finishedLines.forEach(line => viewer.entities.remove(line.entity));
            this.finishedLines = [];
        };
    }

    private startDrawing(viewer: Viewer, position: any, config?: DrawLineConfig) {
        this.isDrawing = true;
        this.tempPoints = [viewer.scene.pickPosition(position)];

        this.tempEntity = viewer.entities.add({
            polyline: {
                positions: new CallbackProperty(() => this.tempPoints, false),
                width: config?.strokeWidth || 3,
                material: config?.strokeColor || Color.fromCssColorString('#FF3B30'),
                clampToGround: true // 贴地显示
            }
        });
    }

    private addPoint(viewer: Viewer, position: any) {
        const newPoint = viewer.scene.pickPosition(position);
        if (newPoint) {
            this.tempPoints.push(newPoint);
            viewer.scene.requestRender();
        }
    }

    private finishDrawing(viewer: Viewer, config?: DrawLineConfig) {
        if (this.tempPoints.length > 1) {
            // 将临时线条转为永久实体
            const permanentEntity = viewer.entities.add({
                polyline: {
                    positions: this.tempPoints,
                    width: this.tempEntity.polyline.width.getValue(),
                    material: this.tempEntity.polyline.material,
                    clampToGround: true
                }
            });

            this.finishedLines.push({
                entity: permanentEntity,
                points: [...this.tempPoints]
            });
        }

        this.isDrawing = false;
        config?.onDrawEnd?.(this.tempPoints);
        this.cleanTempData(viewer);  // 仅清理临时数据
    }

    private cleanTempData(viewer: Viewer) {
        if (this.tempEntity) {
            viewer.entities.remove(this.tempEntity);
            this.tempEntity = undefined;
        }
        this.tempPoints = [];
    }
    private cancelDrawing(viewer: Viewer) {
        this.isDrawing = false;
        this.cleanTempData(viewer);
    }
}

