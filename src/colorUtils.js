// Convierte de HEX a HSL
export const hexToHSL = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

// Convierte de HSL a HEX
export const hslToHex = (h, s, l) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

// Generador de Armonías
export const generateHarmonies = (baseHex) => {
  const { h, s, l } = hexToHSL(baseHex);
  
  // Helpers para asegurar que los valores estén dentro de rangos legibles
  const clampL = (val) => Math.max(15, Math.min(85, val)); 
  const clampS = (val) => Math.max(10, Math.min(100, val));
  const wrapH = (val) => (val + 360) % 360;

  return [
    {
      nombre: "Contraste Audaz (Complementaria)",
      colores: [
        baseHex, 
        hslToHex(wrapH(h + 180), clampS(s), clampL(l - 20)), // Opuesto más oscuro
        hslToHex(wrapH(h + 180), clampS(s + 20), clampL(l + 15)) // Opuesto más claro
      ],
      tags: ["Generada por IA"]
    },
    {
      nombre: "Vibra Natural (Análoga)",
      colores: [
        baseHex,
        hslToHex(wrapH(h + 30), clampS(s), clampL(l - 15)),
        hslToHex(wrapH(h - 30), clampS(s), clampL(l + 10))
      ],
      tags: ["Generada por IA"]
    },
    {
      nombre: "Elegancia Pura (Monocromática)",
      colores: [
        baseHex,
        hslToHex(h, clampS(s - 10), clampL(l - 35)), // Mucho más oscuro
        hslToHex(h, clampS(s - 20), clampL(l + 25))  // Más claro
      ],
      tags: ["Generada por IA"]
    },
    {
      nombre: "Equilibrio Perfecto (Dividida)",
      colores: [
        baseHex,
        hslToHex(wrapH(h + 150), clampS(s), clampL(l - 15)),
        hslToHex(wrapH(h + 210), clampS(s), clampL(l + 10))
      ],
      tags: ["Generada por IA"]
    }
  ];
};
