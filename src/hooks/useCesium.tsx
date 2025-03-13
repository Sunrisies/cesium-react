import { useEffect, useRef, forwardRef } from 'react'
import { Viewer, Ion, Camera, Rectangle, ScreenSpaceEventType } from 'cesium'
import { defaultAccessToken } from '../config'

interface CesiumViewerProps {
    options?: Viewer.ConstructorOptions
    className?: string
}

const CesiumViewer = forwardRef<Viewer, CesiumViewerProps>(
    ({ options = {}, className = '' }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null)
        const viewerRef = useRef<Viewer>()

        useEffect(() => {
            if (containerRef.current) {
                Ion.defaultAccessToken = defaultAccessToken
                Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(89.5, 20.4, 110.4, 61.2)
                viewerRef.current = new Viewer(containerRef.current, options)
                const creditContainer = viewerRef.current.cesiumWidget.creditContainer as HTMLElement
                creditContainer!.style!.display = 'none'
                // 禁用地形
                viewerRef.current.scene.globe.depthTestAgainstTerrain = false
                // 禁用左键双击功能
                viewerRef.current.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
                // this.map.viewer.scene.debugShowFramesPerSecond = import.meta.env.VITE_IS_PS!
                // 开启渲染帧率显示
                // this.map.viewer.scene.debugShowFramesPerSecond = false
                // 开启抗锯齿
                viewerRef.current.scene.postProcessStages.fxaa.enabled = false
                viewerRef.current.scene.debugShowFramesPerSecond = true
                // 暴露 ref
                if (typeof ref === 'function') {
                    ref(viewerRef.current)
                } else if (ref) {
                    ref.current = viewerRef.current
                }

                // 自适应父容器尺寸
                viewerRef.current.resize()
            }

            return () => {
                viewerRef.current?.destroy()
            }
        }, [options, ref])

        return (
            <div
                ref={ containerRef }
                className={ className }
                style={ { width: '100%', height: '100%' } }
            />
        )
    }
)

export default CesiumViewer