/**
 * Calculates the relative luminance of a color.
 * Accepts hex colors (#FFF, #FFFFFF).
 */
const getLuminance = (hex) => {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  
  if (color.length !== 6) return 0.5; // fallback

  const r = parseInt(color.substring(0, 2), 16) / 255;
  const g = parseInt(color.substring(2, 4), 16) / 255;
  const b = parseInt(color.substring(4, 6), 16) / 255;

  const getL = (c) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const R = getL(r);
  const G = getL(g);
  const B = getL(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

/**
 * Maps a color to a CSS variable based on its luminance.
 */
const mapColorToCSSVar = (colorString) => {
  // If it's none, transparent, or already a var, ignore
  if (!colorString || colorString.toLowerCase() === 'none' || colorString.toLowerCase() === 'transparent' || colorString.startsWith('var(')) {
    return colorString;
  }
  
  // Very basic color detection, assuming mostly hex from SVG exports.
  // We can expand this to handle rgb/rgba if needed, but Canva SVGs usually export Hex.
  let hex = colorString;
  if (!colorString.startsWith('#')) {
    // Return base if it's an unparseable named color just to force harmony
    return 'var(--color-primary-text)';
  }

  const luminance = getLuminance(hex);
  
  if (luminance > 0.7) {
    return 'var(--color-base)'; // Light colors map to Background/Base
  } else if (luminance > 0.2) {
    return 'var(--color-accent)'; // Mid colors map to Accent
  } else {
    return 'var(--color-primary-text)'; // Dark colors map to Primary Text
  }
};

/**
 * Parses an SVG string, removes scripts, maps colors to variables,
 * and returns a sanitized SVG string ready to inject.
 */
export const processSVGTemplate = (svgString) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');

    // 1. Sanitize: Remove all script tags
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    // 2. Map colors
    const elements = doc.querySelectorAll('*');
    elements.forEach(el => {
      // Process fill attribute
      if (el.hasAttribute('fill')) {
        const fill = el.getAttribute('fill');
        el.setAttribute('fill', mapColorToCSSVar(fill));
      }
      // Process stroke attribute
      if (el.hasAttribute('stroke')) {
        const stroke = el.getAttribute('stroke');
        el.setAttribute('stroke', mapColorToCSSVar(stroke));
      }
      // Process inline styles
      if (el.style) {
        if (el.style.fill) {
          el.style.fill = mapColorToCSSVar(el.style.fill);
        }
        if (el.style.stroke) {
          el.style.stroke = mapColorToCSSVar(el.style.stroke);
        }
        if (el.style.color) {
          el.style.color = mapColorToCSSVar(el.style.color);
        }
      }
    });

    // Make sure SVG scales nicely
    const svgTag = doc.querySelector('svg');
    if (svgTag) {
      svgTag.setAttribute('width', '100%');
      svgTag.setAttribute('height', '100%');
      svgTag.style.width = '100%';
      svgTag.style.height = '100%';
    }

    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc.documentElement);
  } catch (error) {
    console.error("Error procesando SVG:", error);
    return null;
  }
};
