import CesiumViewer from './hooks/useCesium'

export default function App() {

  return (
    <div className="h-screen w-full">
      <CesiumViewer
        className="h-full"
        options={ {
          animation: false,
          timeline: false,
          baseLayerPicker: false, // 是否显示图层选择控件
          infoBox: false, // 信息框
          homeButton: false, // 显示默认的地图导航控制按钮
          navigationHelpButton: false, // 显示帮助信息按钮
          sceneModePicker: false, // 显示场景模式切换按钮
          selectionIndicator: false, // 显示选中指示器
          navigationInstructionsInitiallyVisible: false, // 导航说明控件是否显示
          geocoder: false
        } }
      />
    </div>
  )
}