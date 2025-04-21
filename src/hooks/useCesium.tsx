import {
  CallbackProperty,
  Camera,
  Cartesian3,
  Color,
  HeightReference,
  Ion,
  Rectangle,
  ScreenSpaceEventType,
  StripeMaterialProperty,
  Viewer,
} from "cesium";
import { installPlugins } from "@/utils/index";
import { forwardRef, useEffect, useRef } from "react";
import { defaultAccessToken } from "../config";
const sk = ({
  lng,
  lat,
  height,
}: {
  lng: number;
  lat: number;
  height: number;
}) => {
  let r1 = 0;
  let r2 = 0;
  return {
    position: Cartesian3.fromDegrees(
      lng || 113.935913,
      lat || 22.525335,
      height || 1
    ),
    ellipse: {
      show: true,
      sizeInMeters: true,
      semiMinorAxis: new CallbackProperty(() => {
        r1 = r1 + 0.4;
        if (r1 >= 300) {
          r1 = 0;
        }
        return r1;
      }, false),
      semiMajorAxis: new CallbackProperty(() => {
        r2 = r2 + 0.4;
        if (r2 >= 300) {
          r2 = 0;
        }
        return r2;
      }, false),
      material: new StripeMaterialProperty({
        evenColor: Color.fromCssColorString("rgba(8, 247, 111,0.4)"),
        oddColor: Color.fromCssColorString("rgba(0, 201, 87, 0.1)"),
      }),
      height: 1.0,
      heightReference: HeightReference.RELATIVE_TO_GROUND,
      outline: true,
      outlineWidth: 2,
      outlineColor: Color.fromCssColorString("rgba(141, 8, 41, 0.5)"),
    },
  };
};
interface CesiumViewerProps {
  options?: Viewer.ConstructorOptions;
  className?: string;
}

const CesiumViewer = forwardRef<Viewer, CesiumViewerProps>(
  ({ options = {}, className = "" }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Viewer>(null);
    let cleanupPlugins: () => void = () => {};
    useEffect(() => {
      if (containerRef.current) {
        Ion.defaultAccessToken = defaultAccessToken;
        Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
          89.5,
          20.4,
          110.4,
          61.2
        );

        viewerRef.current = new Viewer(containerRef.current, { ...options });
        const creditContainer = viewerRef.current.cesiumWidget
          .creditContainer as HTMLElement;
        creditContainer!.style!.display = "none";
        // 禁用地形
        viewerRef.current.scene.globe.depthTestAgainstTerrain = false;
        // 禁用左键双击功能
        viewerRef.current.cesiumWidget.screenSpaceEventHandler.removeInputAction(
          ScreenSpaceEventType.LEFT_DOUBLE_CLICK
        );
        // 开启抗锯齿
        viewerRef.current.scene.postProcessStages.fxaa.enabled = false;
        viewerRef.current.scene.debugShowFramesPerSecond = true;
        viewerRef.current.camera.setView({
          // 从以度为单位的经度和纬度值返回笛卡尔3位置。
          destination: Cartesian3.fromDegrees(120.36, 36.09, 10000),
        });
        // 使用插件
        cleanupPlugins = installPlugins(viewerRef.current, [
          //   {
          //     name: "ClickHandler",
          //     options: {
          //       onLeftClick: ({ x, y, Lat, Lon }, pickedObjects) => {
          //         console.log(x, y, Lat, Lon, pickedObjects); // 处理点击事件的逻辑
          //       },
          //       onRightClick: ({ x, y, Lat, Lon }, pickedObjects) => {
          //         console.log(x, y, Lat, Lon, pickedObjects); // 处理点击事件的逻辑
          //       },
          //     },
          //   },
          {
            name: "DrawLine",
            options: {
              onDrawEnd: () => {
                console.log("绘制完成----"); // 处理点击事件的逻辑
              },
              deleteDrawing: (viewer, temp, temps) => {
                console.log(viewer, temp, temps); // 处理点击事件的逻辑
              },
            },
          },
        ]);
        // 暴露 ref
        if (typeof ref === "function") {
          ref(viewerRef.current);
        } else if (ref) {
          ref.current = viewerRef.current;
        }
        const data = sk({ lng: 120.36, lat: 36.09, height: 10 });
        viewerRef.current.entities.add(data);

        // 自适应父容器尺寸
        viewerRef.current.resize();
      }

      return () => {
        cleanupPlugins();
        viewerRef.current?.destroy();
      };
    }, [options, ref]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
);
export default CesiumViewer;
