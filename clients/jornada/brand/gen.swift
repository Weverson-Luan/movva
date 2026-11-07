import AppKit
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

// Uso: swift gen.swift <mark.png> <text.svg> <movvaOnboardingDir> <outDir>
let args = CommandLine.arguments
let markPath = args[1], textSvg = args[2], onbDir = args[3], out = args[4]

let navy = (r: 0x01, g: 0x1C, b: 0x3A)
let cs = CGColorSpaceCreateDeviceRGB()

final class Bitmap {
  let w: Int, h: Int
  var px: [UInt8]
  init(w: Int, h: Int) { self.w = w; self.h = h; px = [UInt8](repeating: 0, count: w * h * 4) }
  convenience init(cg: CGImage) {
    self.init(w: cg.width, h: cg.height)
    withCtx { $0.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h)) }
  }
  // Contexto com origem no topo-esquerdo (y para baixo), igual às coordenadas da imagem.
  func withCtx(_ body: (CGContext) -> Void) {
    px.withUnsafeMutableBytes { buf in
      let ctx = CGContext(data: buf.baseAddress, width: w, height: h, bitsPerComponent: 8,
                          bytesPerRow: w * 4, space: cs,
                          bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
      body(ctx)
    }
  }
  func get(_ x: Int, _ y: Int) -> (Int, Int, Int, Int) {
    let i = (y * w + x) * 4  // buffer do CG: linha 0 = topo
    return (Int(px[i]), Int(px[i + 1]), Int(px[i + 2]), Int(px[i + 3]))
  }
  func set(_ x: Int, _ y: Int, _ c: (Int, Int, Int, Int)) {
    let i = (y * w + x) * 4
    px[i] = UInt8(c.0); px[i + 1] = UInt8(c.1); px[i + 2] = UInt8(c.2); px[i + 3] = UInt8(c.3)
  }
  func cgImage() -> CGImage {
    var copy = px
    return copy.withUnsafeMutableBytes { buf in
      CGContext(data: buf.baseAddress, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!.makeImage()!
    }
  }
  func save(_ path: String, opaque: Bool = false) {
    var img = cgImage()
    if opaque {  // ícone iOS: sem canal alpha
      let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0, space: cs,
                          bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
      ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h)); img = ctx.makeImage()!
    }
    let url = URL(fileURLWithPath: path)
    let dest = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(dest, img, nil); CGImageDestinationFinalize(dest)
    print("ok", path, w, "x", h)
  }
}

func loadCG(_ path: String) -> CGImage {
  let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil)!
  return CGImageSourceCreateImageAtIndex(src, 0, nil)!
}

// --- 1) Marca: fundo navy + desenho branco → máscara (alpha = quão branco é o pixel) ---
let mark = Bitmap(cg: loadCG(markPath))
let navyLum = 0.299 * Double(navy.r) + 0.587 * Double(navy.g) + 0.114 * Double(navy.b)
func glyph(color: (Int, Int, Int)) -> Bitmap {
  let g = Bitmap(w: mark.w, h: mark.h)
  for y in 0..<mark.h { for x in 0..<mark.w {
    let (r, gg, b, _) = mark.get(x, y)
    let lum = 0.299 * Double(r) + 0.587 * Double(gg) + 0.114 * Double(b)
    let a = max(0, min(1, (lum - navyLum) / (255 - navyLum)))
    let A = Int((a * 255).rounded())
    // premultiplied
    g.set(x, y, (color.0 * A / 255, color.1 * A / 255, color.2 * A / 255, A))
  } }
  return g
}
func bbox(_ b: Bitmap) -> CGRect {
  var x0 = b.w, y0 = b.h, x1 = 0, y1 = 0
  for y in 0..<b.h { for x in 0..<b.w where b.get(x, y).3 > 8 {
    x0 = min(x0, x); y0 = min(y0, y); x1 = max(x1, x); y1 = max(y1, y)
  } }
  return CGRect(x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1)
}
// Coloca o recorte `r` de `src` centralizado num canvas size×size, cabendo em `fit` px.
func place(_ src: Bitmap, _ r: CGRect, size: Int, fit: Double) -> Bitmap {
  let out = Bitmap(w: size, h: size)
  let s = fit / max(r.width, r.height)
  let dw = r.width * s, dh = r.height * s
  let crop = src.cgImage().cropping(to: r)!
  out.withCtx { ctx in
    ctx.interpolationQuality = .high
    ctx.draw(crop, in: CGRect(x: (Double(size) - dw) / 2, y: (Double(size) - dh) / 2, width: dw, height: dh))
  }
  return out
}

mark.save("\(out)/icon.png", opaque: true)
mark.save("\(out)/logo.png")
let white = glyph(color: (255, 255, 255))
let gbox = bbox(white)
print("glyph bbox", gbox)
place(white, gbox, size: 1024, fit: 500).save("\(out)/adaptive-icon.png")  // zona segura do Android
place(white, gbox, size: 1024, fit: 760).save("\(out)/splash.png")
let navyGlyph = glyph(color: (navy.r, navy.g, navy.b))
place(navyGlyph, gbox, size: 1024, fit: 900).save("\(out)/login-logo.png")

// --- 2) Wordmark: paths do texto "JORNADA" do logo-jornada.svg, em navy, recortado justo ---
let svg = NSImage(contentsOfFile: textSvg)!
let scale = 14.0
let tw = Int(svg.size.width * scale), th = Int(svg.size.height * scale)
let txt = Bitmap(w: tw, h: th)
txt.withCtx { ctx in
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = NSGraphicsContext(cgContext: ctx, flipped: false)
  svg.draw(in: NSRect(x: 0, y: 0, width: tw, height: th))
  NSGraphicsContext.restoreGraphicsState()
}
// recolore para navy mantendo o alpha
for y in 0..<th { for x in 0..<tw {
  let a = txt.get(x, y).3
  txt.set(x, y, (navy.r * a / 255, navy.g * a / 255, navy.b * a / 255, a))
} }
let tb = bbox(txt)
let wm = Bitmap(w: Int(tb.width), h: Int(tb.height))
wm.withCtx { $0.draw(txt.cgImage().cropping(to: tb)!, in: CGRect(x: 0, y: 0, width: tb.width, height: tb.height)) }
wm.save("\(out)/wordmark.png")

// --- 3) Onboarding: troca a família do vermelho do Movva por navy e "MOVVA" por "JORNADA" ---
let red = (r: 230.0, g: 57.0, b: 70.0)
func recolor(_ b: Bitmap) {
  for y in 0..<b.h { for x in 0..<b.w {
    let (r, g, bb, a) = b.get(x, y)
    guard a > 0, r - max(g, bb) >= 6, abs(g - bb) <= 40 else { continue }  // família do vermelho
    let R = Double(r), G = Double(g)
    var n: (Double, Double, Double)
    if R >= 222 {  // tinta: branco → vermelho
      let t = max(0, min(1, (255 - G) / (255 - red.g)))
      n = (255 + t * (Double(navy.r) - 255), 255 + t * (Double(navy.g) - 255), 255 + t * (Double(navy.b) - 255))
    } else {  // sombra: vermelho → preto (mantém um pouco de luz para não virar preto puro)
      let k = 0.55 + 0.45 * max(0, min(1, R / red.r))
      n = (Double(navy.r) * k, Double(navy.g) * k, Double(navy.b) * k)
    }
    b.set(x, y, (Int(n.0), Int(n.1), Int(n.2), a))
  } }
}
// Troca o texto branco dentro de `win` (x0,y0,x1,y1) por "JORNADA" no mesmo centro e altura.
func replaceText(_ b: Bitmap, _ win: (Int, Int, Int, Int)) {
  var x0 = Int.max, y0 = Int.max, x1 = 0, y1 = 0
  for y in win.1...win.3 { for x in win.0...win.2 {
    let (r, g, bb, _) = b.get(x, y)
    if min(r, g, bb) > 150 { x0 = min(x0, x); y0 = min(y0, y); x1 = max(x1, x); y1 = max(y1, y) }
  } }
  guard x0 < x1 else { print("texto não achado em", win); return }
  // apaga copiando, por coluna, o pixel logo acima do texto (preserva as linhas verticais da carroceria)
  for x in (x0 - 3)...(x1 + 3) {
    let c = b.get(x, y0 - 5)
    for y in (y0 - 3)...(y1 + 3) { b.set(x, y, c) }
  }
  let capH = Double(y1 - y0 + 1), oldW = Double(x1 - x0 + 1)
  let cx = Double(x0 + x1) / 2, cy = Double(y0 + y1) / 2
  let font = NSFont(name: "Helvetica-Bold", size: 10)!
  var size = capH / font.capHeight * 10
  func attr(_ s: Double) -> NSAttributedString {
    NSAttributedString(string: "JORNADA", attributes: [
      .font: NSFont(name: "Helvetica-Bold", size: s)!, .foregroundColor: NSColor.white, .kern: s * 0.12,
    ])
  }
  var str = attr(size)
  let maxW = oldW * 1.45
  if str.size().width > maxW { size *= maxW / str.size().width; str = attr(size) }
  let f = NSFont(name: "Helvetica-Bold", size: size)!
  let sw = str.size().width - size * 0.12  // sem o kern do último caractere
  b.withCtx { ctx in
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(cgContext: ctx, flipped: false)
    // CG: origem embaixo; baseline = centro + capHeight/2 (em coordenadas da imagem)
    let baselineImgY = cy + f.capHeight / 2
    let p = NSPoint(x: cx - sw / 2, y: Double(b.h) - baselineImgY + f.descender)
    str.draw(at: p)
    NSGraphicsContext.restoreGraphicsState()
  }
}
let windows: [[(Int, Int, Int, Int)]] = [
  [(420, 520, 850, 600)],
  [(440, 735, 790, 805), (100, 600, 305, 655), (800, 580, 990, 625)],
  [(190, 570, 555, 640)],
]
try? FileManager.default.createDirectory(atPath: "\(out)/onboarding", withIntermediateDirectories: true)
for i in 1...3 {
  let b = Bitmap(cg: loadCG("\(onbDir)/\(i).png"))
  recolor(b)
  for w in windows[i - 1] { replaceText(b, w) }
  b.save("\(out)/onboarding/\(i).png")
}
