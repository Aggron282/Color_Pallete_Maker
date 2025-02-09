function RenderImg(src, container) {
    setInnerHTML(container, `<img src="${src}" class="display_img" alt="Rendered Image" />`);
}

function RenderGradientOrImage(isImage, src, pure_colors, container) {
    isImage ? RenderImg(src, container) : RenderGradient(pure_colors, container);
}

function RenderColorPallete(grid, palletes) {

    try {

      if (!grid || !palletes) {
          console.error(`Missing grid or palletes. Grid: ${grid}, Pallete: ${palletes}`);
          return;
      }

      grid.innerHTML = palletes.map(ReturnColorElement).join("");

    }
    catch (error) {
        console.error("RenderColorPallete failed:", error);
    }

}

function ReturnColorElement(color){

  return `
  <div class="color-answer" style="background:${color}">
    ${color}
  </div>
  `

}

function RenderGradient(colors, container) {

    if (!colors || !container) return;

    const gradientStyle = colors.length === 1
        ? `background:${colors[0]}`
        : `background: linear-gradient(to bottom, ${colors.join(",")})`;

    setInnerHTML(container, `<div class="img_display" style="${gradientStyle}"></div>`);

}
