import React, { useEffect } from 'react'
import { fabric } from 'fabric'

interface FabricImageCropProps {
  imagePath: string
  children: React.ReactElement
  //绑定的canvas ref
  canvasRef: React.RefObject<HTMLCanvasElement>
}

const FabricImageCrop: React.FC<FabricImageCropProps> = ({
  imagePath,
  children,
  canvasRef
}) => {
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 672,
      height: 432,
      selection: false
    })
    // 加载图像
    fabric.Image.fromURL(imagePath, (img) => {
      const targetHeight = canvas.height // Set the target height to the canvas height
      const scaleFactor = targetHeight / img.height

      // Calculate the scaled width
      const scaledWidth = img.width * scaleFactor

      // Calculate the left position to center the image
      const left = (canvas.width - scaledWidth) / 2

      img.set({
        left: left,
        top: 0, // Align the top of the image with the top of the canvas
        opacity: 0.3,
        selectable: false, // 图片不可选中
        evented: true, // 图片不触发事件
        lockMovementX: true, // 锁定水平移动
        lockMovementY: true, // 锁定垂直移动
        lockScalingX: true, // 锁定水平缩放
        lockScalingY: true, // 锁定垂直缩放
        lockRotation: true, // 锁定旋转
        scaleX: scaleFactor, // Apply the scaling factor to maintain aspect ratio
        scaleY: scaleFactor // Apply the scaling factor to maintain aspect ratio
      })
      canvas.add(img)
    })

    // 创建裁剪框
    const cropRect = new fabric.Rect({
      width: 320,
      height: 432,
      left: (canvas.width - 320) / 2,
      fill: 'transparent',
      stroke: '#168ef9',
      strokeWidth: 1,
      resizable: true,
      hasRotatingPoint: true, // 取消旋转功能
      lockScalingFlip: true,
      // cornerColor: 'transparent' // 设置控制点颜色为红色
      cornerColor: '#001F3F',
      cornerStrokeColor: '#004080'
    })

    cropRect.setControlsVisibility({
      mt: false, //上中控制点（Middle Top）不可见
      mb: false, //下中控制点（Middle Bottom）不可见
      ml: false, //左中控制点（Middle Left）不可见
      mr: false, //右中控制点（Middle Right）不可见
      bl: true, //左下控制点（Bottom Left）可见
      br: true, //右下控制点（Bottom Right）可见
      tl: true, //左上控制点（Top Left）可见
      tr: true //右上控制点（Top Right）可见
    })

    canvas.add(cropRect)

    // 启用裁剪框的缩放和拖动
    canvas.setActiveObject(cropRect)
    canvas.requestRenderAll()

    //设置裁剪框范围内的图片可见
    fabric.util.clipImage = (ctx, img, cropRect) => {
      const scaleX = img.scaleX
      const scaleY = img.scaleY
      const left = img.left - img.width / 2
      const top = img.top - img.height / 2
      const clipX = cropRect.left - cropRect.width / 2
      const clipY = cropRect.top - cropRect.height / 2

      ctx.save()
      ctx.beginPath()
      ctx.rect(clipX, clipY, cropRect.width, cropRect.height)
      ctx.closePath()
      ctx.restore()
      ctx.clip()

      ctx.drawImage(
        img._element,
        left,
        top,
        img.width * scaleX,
        img.height * scaleY
      )
    }

    // 应用裁剪效果
    cropRect.clipTo = (ctx) => {
      fabric.util.clipImage(ctx, canvas.getActiveObject(), cropRect)
    }

    canvas.on('mouse:down', () => {})

    canvas.on('mouse:up', () => {})

    canvas.on('object:moving', () => {
      // 裁剪框移动时，限制移动范围
    })

    // 处理裁剪

    // 销毁时清理资源
    return () => {
      canvas.dispose()
    }
  }, [imagePath, children, canvasRef])

  return <>{React.cloneElement(children)}</>
}

export default FabricImageCrop
