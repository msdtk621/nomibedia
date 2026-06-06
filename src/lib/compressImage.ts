// クライアント側で画像を縮小・圧縮する（スマホの大きな写真がサーバーのサイズ上限を
// 超えてアップロード失敗するのを防ぐ）。返り値は圧縮済みのFile。
export async function compressImage(file: File, maxDim = 1280, quality = 0.82): Promise<File> {
  try {
    if (!file.type.startsWith('image/')) return file
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    const img: HTMLImageElement = await new Promise((resolve, reject) => {
      const i = new window.Image()
      i.onload = () => resolve(i)
      i.onerror = reject
      i.src = dataUrl
    })
    let { width, height } = img
    if (width > maxDim || height > maxDim) {
      if (width >= height) {
        height = Math.round((height * maxDim) / width)
        width = maxDim
      } else {
        width = Math.round((width * maxDim) / height)
        height = maxDim
      }
    }
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(img, 0, 0, width, height)
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!blob) return file
    // 圧縮で逆に大きくなった場合は元のまま
    if (blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })
  } catch {
    return file
  }
}

// 圧縮したFileを<input type=file>に書き戻す（フォーム送信で圧縮版が送られるように）
export function setFileInput(input: HTMLInputElement | null, file: File) {
  if (!input) return
  const dt = new DataTransfer()
  dt.items.add(file)
  input.files = dt.files
}
