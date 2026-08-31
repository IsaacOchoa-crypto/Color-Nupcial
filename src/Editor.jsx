import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { motion, useDragControls } from 'framer-motion';
import { processSVGTemplate } from './svgUtils';

// Componente de texto arrastrable e interactivo (Ahora con Animaciones)
const DraggableText = ({ tag: Tag = 'div', className, defaultText, style, constraintsRef, delay = 0 }) => {
  const controls = useDragControls();

  return (
    <motion.div 
      drag 
      dragConstraints={constraintsRef}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      className="relative group flex items-center justify-center z-20 hover:z-50"
      style={{ position: 'relative' }}
    >
      <div 
        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-move text-gray-500 p-1.5 bg-white/90 rounded border border-gray-200 shadow-sm backdrop-blur transition-opacity z-50 pointer-events-auto"
        onPointerDown={(e) => controls.start(e)}
        title="Arrastrar para mover"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 2H6V8l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/>
        </svg>
      </div>
      
      <Tag
        className={`outline-none hover:outline-dashed hover:outline-1 hover:outline-gray-300 focus:outline-solid focus:outline-2 focus:outline-rose-400 cursor-text min-w-[20px] transition-all whitespace-pre-wrap ${className}`}
        contentEditable={true}
        suppressContentEditableWarning={true}
        spellCheck={false}
        style={style}
        onPointerDown={(e) => e.stopPropagation()} 
      >
        {defaultText}
      </Tag>
    </motion.div>
  );
};

// Componente de Gráfico/Foto arrastrable (Auto-Layout + Animaciones)
const DraggableSVG = ({ id, svgType, color, className, constraintsRef, onDelete, src, delay = 0 }) => {
  const controls = useDragControls();

  const renderSVG = () => {
    switch (svgType) {
      case 'rama':
        return (
          <svg className="w-full h-full pointer-events-none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 C30,0 50,20 50,50 C50,20 70,0 100,0 C70,0 50,30 50,60 C50,30 30,0 0,0" fill={color} opacity="0.6"/>
            <path d="M0,10 C40,10 60,30 60,60" fill="none" stroke={color} strokeWidth="1.5" opacity="0.8"/>
            <path d="M10,0 C30,40 30,60 10,60" fill="none" stroke={color} strokeWidth="1" opacity="0.5"/>
            <circle cx="20" cy="15" r="2" fill={color} />
            <circle cx="15" cy="25" r="1.5" fill={color} />
          </svg>
        );
      case 'hoja':
        return (
          <svg className="w-full h-full pointer-events-none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 20 C40 30, 20 40, 20 50 C20 60, 40 70, 50 80 C60 70, 80 60, 80 50 C80 40, 60 30, 50 20 Z" fill={color} opacity="0.7"/>
            <path d="M50 20 L50 90" stroke={color} strokeWidth="1.5" opacity="0.9" fill="none"/>
          </svg>
        );
      case 'separador':
        return (
          <svg className="w-full h-full pointer-events-none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50 L90 50" stroke={color} strokeWidth="1.5" opacity="0.7" fill="none"/>
            <circle cx="50" cy="50" r="4" fill={color} />
            <path d="M45 50 L50 45 L55 50 L50 55 Z" fill={color} opacity="0.8"/>
          </svg>
        );
      case 'flores':
        return (
          <svg className="w-full h-full pointer-events-none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 20 C60 10, 80 20, 70 40 C60 60, 40 60, 30 40 C20 20, 40 10, 50 20 Z" fill={color} opacity="0.6"/>
            <path d="M50 20 C40 10, 20 20, 30 40 C40 60, 60 60, 70 40 C80 20, 60 10, 50 20 Z" fill={color} opacity="0.5"/>
            <circle cx="50" cy="35" r="5" fill={color} opacity="0.9"/>
            <path d="M50 50 C55 70, 70 80, 80 90" fill="none" stroke={color} strokeWidth="1.5" opacity="0.8"/>
            <path d="M50 50 C45 70, 30 80, 20 90" fill="none" stroke={color} strokeWidth="1.5" opacity="0.8"/>
          </svg>
        );
      case 'anillos':
        return (
          <svg className="w-full h-full pointer-events-none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="50" r="20" fill="none" stroke={color} strokeWidth="2" opacity="0.8"/>
            <circle cx="60" cy="50" r="20" fill="none" stroke={color} strokeWidth="2" opacity="0.8"/>
            <circle cx="40" cy="50" r="18" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5"/>
            <circle cx="60" cy="50" r="18" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5"/>
            <circle cx="50" cy="35" r="2" fill={color} opacity="0.9"/>
          </svg>
        );
      case 'esquina_deco':
        return (
          <svg className="w-full h-full pointer-events-none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10 L90 10 L90 15 L15 15 L15 90 L10 90 Z" fill={color} opacity="0.8"/>
            <path d="M25 25 L90 25 L90 30 L30 30 L30 90 L25 90 Z" fill={color} opacity="0.6"/>
            <path d="M40 40 L90 40 L90 45 L45 45 L45 90 L40 90 Z" fill={color} opacity="0.4"/>
          </svg>
        );
      case 'corona':
        return (
          <svg className="w-full h-full pointer-events-none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="1" opacity="0.5" strokeDasharray="4 2"/>
            <path d="M50 10 C60 0, 70 20, 50 30 C30 20, 40 0, 50 10 Z" fill={color} opacity="0.8"/>
            <path d="M50 90 C60 100, 70 80, 50 70 C30 80, 40 100, 50 90 Z" fill={color} opacity="0.8"/>
            <path d="M10 50 C0 40, 20 30, 30 50 C20 70, 0 60, 10 50 Z" fill={color} opacity="0.8"/>
            <path d="M90 50 C100 40, 80 30, 70 50 C80 70, 100 60, 90 50 Z" fill={color} opacity="0.8"/>
          </svg>
        );
      // FASE 2: MÁSCARAS FOTOGRÁFICAS
      case 'foto-arco':
        return (
          <div className="w-full h-full pointer-events-none overflow-hidden border-[3px]" style={{ borderRadius: '1000px 1000px 0 0', borderColor: color }}>
            <img src={src} className="w-full h-full object-cover" alt="Recorte Arco" />
          </div>
        );
      case 'foto-circulo':
        return (
          <div className="w-full h-full pointer-events-none overflow-hidden rounded-full border-[3px]" style={{ borderColor: color }}>
            <img src={src} className="w-full h-full object-cover" alt="Recorte Circular" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      drag 
      dragConstraints={constraintsRef}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: delay, ease: "backOut" }}
      className={`group absolute z-30 hover:z-50 ${className}`}
    >
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-opacity z-50 pointer-events-auto">
        <div 
          className="cursor-move text-gray-500 p-1.5 bg-white/90 rounded border border-gray-200 shadow-sm backdrop-blur hover:text-gray-800"
          onPointerDown={(e) => controls.start(e)}
          title="Mover Gráfico"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 2H6V8l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/></svg>
        </div>
        <button 
          onClick={() => onDelete(id)}
          className="cursor-pointer text-rose-400 p-1.5 bg-white/90 rounded border border-gray-200 shadow-sm backdrop-blur hover:bg-rose-50 hover:text-rose-600"
          title="Eliminar Gráfico"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
      {renderSVG()}
    </motion.div>
  );
};

const Editor = ({ customTemplates = [], setCustomTemplates }) => {
  const [activeTemplate, setActiveTemplate] = useState('botanical');
  const [backgroundImage, setBackgroundImage] = useState(null);
  
  // Elementos añadidos por el usuario (Auto-Layout)
  const [addedElements, setAddedElements] = useState([]);
  
  // FASE 3: ESTADO PARA FORZAR LA ANIMACIÓN (Video Mode)
  const [animationKey, setAnimationKey] = useState(0);

  // FASE 1: ESTADO GLOBAL DE TEXTOS MÁGICOS
  const [texts, setTexts] = useState({
    botanicalIntro: "Nos complace invitarte a celebrar nuestra boda",
    names: "Isaac & Evelyn",
    date: "Sábado, 25 de Octubre",
    year: "Dos mil veintiséis",
    location: "Hacienda Los Arcángeles",
    city: "Ciudad de México",
    minimalTitle: "CELEBRAMOS NUESTRO AMOR",
    minimalDate: "25.10.2026",
    minimalLocation: "SALÓN EL DORADO",
    minimalTime: "Recepción a las 20:00 hrs",
    photoIntro: "CON GRAN ALEGRÍA",
    photoAction: "TE INVITAN A SU BODA",
    photoDateBox: "25 OCT 2026",
    photoTimeBox: "A LAS 4:00 PM",
    photoLocation: "Jardín Botánico",
    bohoIntro: "VEN A CELEBRAR",
    classicInitials: "I & E",
    avantGardeLabel: "LA BODA DE"
  });

  const [themeColors, setThemeColors] = useState({
    background: '#FDFBF7',
    primaryText: '#22543D',
    secondaryText: '#4A5568',
    accent: '#D49A89'
  });
  const [fontFamily, setFontFamily] = useState("'Playfair Display', serif");
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const frameInputRef = useRef(null);
  const canvaInputRef = useRef(null);
  const [frameInputType, setFrameInputType] = useState(null);

  const handleCanvaUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const svgContent = event.target.result;
        const processedSvg = processSVGTemplate(svgContent);
        if (processedSvg) {
          const newTemplate = { id: Date.now(), svg: processedSvg };
          if (setCustomTemplates) {
            setCustomTemplates([...customTemplates, newTemplate]);
          }
          setActiveTemplate(`custom-${newTemplate.id}`);
          setAddedElements([]); // Limpiar elementos para la nueva plantilla
        }
      };
      reader.readAsText(file);
    } else {
      alert('Por favor sube un archivo SVG válido descargado de Canva.');
    }
    e.target.value = null;
  };

  // Generador Mágico de Textos
  const applyMagicText = (style) => {
    if (style === 'formal') {
      setTexts({...texts, 
        botanicalIntro: "Tienen el honor de invitarle al enlace matrimonial",
        minimalTitle: "ENLACE MATRIMONIAL",
        photoIntro: "NUESTRAS FAMILIAS CELEBRAN",
        photoAction: "TIENEN EL HONOR DE INVITARLE",
        bohoIntro: "ACOMPÁÑENNOS",
        avantGardeLabel: "CELEBRACIÓN MATRIMONIAL"
      });
    } else if (style === 'romantic') {
      setTexts({...texts, 
        botanicalIntro: "Nuestras almas se encontraron y compartimos nuestra felicidad",
        minimalTitle: "EL INICIO DE NUESTRA HISTORIA",
        photoIntro: "CON EL CORAZÓN LLENO DE AMOR",
        photoAction: "NOS UNIMOS PARA SIEMPRE",
        bohoIntro: "NUESTRO DÍA MÁGICO",
        avantGardeLabel: "EL AMOR DE"
      });
    } else if (style === 'modern') {
      setTexts({...texts, 
        botanicalIntro: "¡Nos casamos! Y no podemos imaginar este día sin ti",
        minimalTitle: "¡NOS CASAMOS!",
        photoIntro: "SE PRENDIÓ LA FIESTA",
        photoAction: "¡ACOMPÁÑANOS A CELEBRAR!",
        bohoIntro: "FIESTA DE BODA",
        avantGardeLabel: "NOS CASAMOS"
      });
    }
    // Reprogramar la animación para que los nuevos textos aparezcan suavemente
    setAnimationKey(prev => prev + 1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };

  const triggerFrameUpload = (type) => {
    setFrameInputType(type);
    frameInputRef.current.click();
  };

  const handleFrameUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      handleAddElement(frameInputType, imageUrl);
    }
    // Limpiar input
    e.target.value = null;
  };

  // Motor de Composición Inteligente
  const handleAddElement = (type, imageUrl = null) => {
    const currentCount = addedElements.length;
    let smartClasses = "";
    
    // Tamaños dinámicos
    const isPhoto = type.includes('foto');
    const widthClass = isPhoto ? 'w-48' : 'w-32';
    const heightClass = type === 'foto-arco' ? 'h-64' : (isPhoto ? 'w-48 h-48' : 'h-32');

    if (currentCount === 0) {
      smartClasses = `top-6 left-6 ${widthClass} ${heightClass}`;
    } else if (currentCount === 1) {
      smartClasses = `bottom-6 right-6 ${widthClass} ${heightClass} rotate-180 origin-center`;
      if (isPhoto) smartClasses = `bottom-6 right-6 ${widthClass} ${heightClass}`; // No voltear fotos
    } else if (currentCount === 2) {
      smartClasses = `top-6 left-1/2 -translate-x-1/2 ${isPhoto ? widthClass : 'w-24'} ${isPhoto ? heightClass : 'h-24'}`;
    } else if (currentCount === 3) {
      smartClasses = `bottom-6 left-1/2 -translate-x-1/2 ${isPhoto ? widthClass : 'w-24'} ${isPhoto ? heightClass : 'h-24'} rotate-180 origin-center`;
      if (isPhoto) smartClasses = `bottom-6 left-1/2 -translate-x-1/2 ${widthClass} ${heightClass}`; // No voltear fotos
    } else {
      smartClasses = `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isPhoto ? widthClass : 'w-24'} ${isPhoto ? heightClass : 'h-24'}`;
    }

    setAddedElements([...addedElements, {
      id: Date.now(),
      type: type,
      classes: smartClasses,
      src: imageUrl
    }]);
  };

  const handleDeleteElement = (idToRemove) => {
    setAddedElements(addedElements.filter(el => el.id !== idToRemove));
  };

  const captureCanvas = async (pixelRatio = 2) => {
    if (!canvasRef.current) return null;
    return await htmlToImage.toPng(canvasRef.current, {
      quality: 1,
      pixelRatio: pixelRatio,
      skipFonts: false,
    });
  };

  const handleDownloadPNG = async () => {
    try {
      const dataUrl = await captureCanvas(2);
      if (!dataUrl) return;
      const link = document.createElement('a');
      link.download = 'invitacion-nupcial.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al descargar PNG:', err);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const dataUrl = await captureCanvas(3);
      if (!dataUrl) return;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [450, 650]
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 450, 650);
      pdf.save('invitacion-nupcial-imprenta.pdf');
    } catch (err) {
      console.error('Error al descargar PDF:', err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 border-t border-gray-200 overflow-hidden">
      {/* Input invisible para los marcos fotográficos */}
      <input type="file" accept="image/*" ref={frameInputRef} onChange={handleFrameUpload} className="hidden" />

      {/* PANEL LATERAL (Herramientas - 25% aprox) */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-sm flex flex-col z-10 h-full">
        <div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-20 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-serif text-gray-800 mb-1">Estudio de Diseño</h2>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">Editor WYSIWYG Avanzado</p>
          </div>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          
          {/* SECCIÓN MÁGICA: Textos y Animación */}
          <div className="mb-8 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              IA Textos Mágicos
            </h3>
            <div className="flex gap-2">
              <button onClick={() => applyMagicText('formal')} className="flex-1 bg-white border border-indigo-200 text-indigo-700 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-indigo-100 transition-colors">Formal</button>
              <button onClick={() => applyMagicText('romantic')} className="flex-1 bg-white border border-indigo-200 text-indigo-700 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-indigo-100 transition-colors">Romántico</button>
              <button onClick={() => applyMagicText('modern')} className="flex-1 bg-white border border-indigo-200 text-indigo-700 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-indigo-100 transition-colors">Moderno</button>
            </div>
          </div>
          
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Decoración y Fotos</h3>
          
          {/* Marcos Fotográficos */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button onClick={() => triggerFrameUpload('foto-arco')} className="bg-rose-50 border border-rose-200 hover:border-rose-400 hover:bg-rose-100 rounded-xl p-2 flex flex-col items-center justify-center transition-all group shadow-sm">
              <svg className="w-8 h-8 text-rose-400 group-hover:text-rose-600 mb-1" viewBox="0 0 100 100" fill="currentColor">
                <path d="M 20 100 L 20 50 A 30 30 0 0 1 80 50 L 80 100 Z" opacity="0.8"/>
              </svg>
              <span className="text-[9px] uppercase font-bold text-rose-600">Foto Arco</span>
            </button>
            <button onClick={() => triggerFrameUpload('foto-circulo')} className="bg-rose-50 border border-rose-200 hover:border-rose-400 hover:bg-rose-100 rounded-xl p-2 flex flex-col items-center justify-center transition-all group shadow-sm">
              <svg className="w-8 h-8 text-rose-400 group-hover:text-rose-600 mb-1" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="30" opacity="0.8" />
              </svg>
              <span className="text-[9px] uppercase font-bold text-rose-600">Foto Círculo</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-8">
            <button onClick={() => handleAddElement('rama')} className="bg-gray-50 border border-gray-100 hover:border-rose-300 hover:bg-rose-50 rounded-xl p-2 flex flex-col items-center justify-center transition-all group shadow-sm">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-rose-400 mb-1" viewBox="0 0 100 100" fill="currentColor">
                 <path d="M0,0 C30,0 50,20 50,50 C50,20 70,0 100,0 C70,0 50,30 50,60 C50,30 30,0 0,0" opacity="0.6"/>
              </svg>
              <span className="text-[9px] uppercase font-bold text-gray-500">Ramo</span>
            </button>
            <button onClick={() => handleAddElement('hoja')} className="bg-gray-50 border border-gray-100 hover:border-rose-300 hover:bg-rose-50 rounded-xl p-2 flex flex-col items-center justify-center transition-all group shadow-sm">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-rose-400 mb-1" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 20 C40 30, 20 40, 20 50 C20 60, 40 70, 50 80 C60 70, 80 60, 80 50 C80 40, 60 30, 50 20 Z" opacity="0.6"/>
              </svg>
              <span className="text-[9px] uppercase font-bold text-gray-500">Hoja</span>
            </button>
            <button onClick={() => handleAddElement('separador')} className="bg-gray-50 border border-gray-100 hover:border-rose-300 hover:bg-rose-50 rounded-xl p-2 flex flex-col items-center justify-center transition-all group shadow-sm">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-rose-400 mb-1" viewBox="0 0 100 100" stroke="currentColor" fill="none">
                 <path d="M10 50 L90 50" strokeWidth="3"/><circle cx="50" cy="50" r="10" fill="currentColor"/>
              </svg>
              <span className="text-[9px] uppercase font-bold text-gray-500">Línea</span>
            </button>
            <button onClick={() => handleAddElement('flores')} className="bg-gray-50 border border-gray-100 hover:border-rose-300 hover:bg-rose-50 rounded-xl p-2 flex flex-col items-center justify-center transition-all group shadow-sm">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-rose-400 mb-1" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 20 C60 10, 80 20, 70 40 C60 60, 40 60, 30 40 C20 20, 40 10, 50 20 Z" opacity="0.6"/>
                <path d="M50 20 C40 10, 20 20, 30 40 C40 60, 60 60, 70 40 C80 20, 60 10, 50 20 Z" opacity="0.5"/>
              </svg>
              <span className="text-[9px] uppercase font-bold text-gray-500">Flores</span>
            </button>
            <button onClick={() => handleAddElement('anillos')} className="bg-gray-50 border border-gray-100 hover:border-rose-300 hover:bg-rose-50 rounded-xl p-2 flex flex-col items-center justify-center transition-all group shadow-sm">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-rose-400 mb-1" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                <circle cx="40" cy="50" r="20" strokeWidth="4"/>
                <circle cx="60" cy="50" r="20" strokeWidth="4"/>
              </svg>
              <span className="text-[9px] uppercase font-bold text-gray-500">Anillos</span>
            </button>
            <button onClick={() => handleAddElement('corona')} className="bg-gray-50 border border-gray-100 hover:border-rose-300 hover:bg-rose-50 rounded-xl p-2 flex flex-col items-center justify-center transition-all group shadow-sm">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-rose-400 mb-1" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"/>
                <path d="M50 10 C60 0, 70 20, 50 30 C30 20, 40 0, 50 10 Z"/>
                <path d="M50 90 C60 100, 70 80, 50 70 C30 80, 40 100, 50 90 Z"/>
              </svg>
              <span className="text-[9px] uppercase font-bold text-gray-500">Corona</span>
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Estilo Global</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
                <span className="text-[10px] uppercase text-gray-500 font-bold border-b border-gray-200 pb-2 mb-1">Paleta Manual</span>
                
                <div className="flex items-center justify-between group">
                  <span className="text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Fondo</span>
                  <div className="relative w-7 h-7 rounded-full overflow-hidden shadow-sm border border-gray-200 shrink-0 cursor-pointer">
                    <input type="color" value={themeColors.background} onChange={(e) => setThemeColors({...themeColors, background: e.target.value})} className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none p-0 m-0" />
                  </div>
                </div>

                <div className="flex items-center justify-between group">
                  <span className="text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Textos Principales</span>
                  <div className="relative w-7 h-7 rounded-full overflow-hidden shadow-sm border border-gray-200 shrink-0 cursor-pointer">
                    <input type="color" value={themeColors.primaryText} onChange={(e) => setThemeColors({...themeColors, primaryText: e.target.value})} className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none p-0 m-0" />
                  </div>
                </div>

                <div className="flex items-center justify-between group">
                  <span className="text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Textos Secundarios</span>
                  <div className="relative w-7 h-7 rounded-full overflow-hidden shadow-sm border border-gray-200 shrink-0 cursor-pointer">
                    <input type="color" value={themeColors.secondaryText} onChange={(e) => setThemeColors({...themeColors, secondaryText: e.target.value})} className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none p-0 m-0" />
                  </div>
                </div>

                <div className="flex items-center justify-between group">
                  <span className="text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Acentos (Gráficos)</span>
                  <div className="relative w-7 h-7 rounded-full overflow-hidden shadow-sm border border-gray-200 shrink-0 cursor-pointer">
                    <input type="color" value={themeColors.accent} onChange={(e) => setThemeColors({...themeColors, accent: e.target.value})} className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none p-0 m-0" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase text-gray-500 font-bold mb-1">Tipografía Principal</span>
                <select 
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="bg-transparent text-sm text-gray-800 outline-none w-full border-b border-gray-200 pb-1 cursor-pointer"
                >
                  <option value="'Playfair Display', serif">Clásica (Playfair)</option>
                  <option value="'Alex Brush', cursive">Romántica (Alex Brush)</option>
                  <option value="'Montserrat', sans-serif">Moderna (Montserrat)</option>
                  <option value="'Courier New', monospace">Minimalista (Courier)</option>
                </select>
              </div>
            </div>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Plantillas Premium</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div onClick={() => { setActiveTemplate('botanical'); setAddedElements([]); }} className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${activeTemplate === 'botanical' ? 'border-rose-400 shadow-md' : 'border-transparent hover:border-gray-200 shadow-sm'}`}>
              <div className="bg-[#fdfbf7] h-20 p-2 flex flex-col items-center justify-center relative">
                 <div className="absolute inset-1 border" style={{ borderColor: themeColors.accent }}></div>
                 <span className="font-serif text-sm" style={{ color: themeColors.primaryText }}>Botánico</span>
              </div>
            </div>

            <div onClick={() => { setActiveTemplate('minimalist'); setAddedElements([]); }} className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${activeTemplate === 'minimalist' ? 'border-rose-400 shadow-md' : 'border-transparent hover:border-gray-200 shadow-sm'}`}>
              <div className="bg-white h-20 p-2 flex flex-col items-center justify-center relative">
                 <div className="w-10 h-px mb-1" style={{ backgroundColor: themeColors.accent }}></div>
                 <span className="font-sans font-light tracking-widest text-[10px] uppercase" style={{ color: themeColors.primaryText }}>Geométrico</span>
                 <div className="w-10 h-px mt-1" style={{ backgroundColor: themeColors.accent }}></div>
              </div>
            </div>

            <div onClick={() => { setActiveTemplate('boho'); setAddedElements([]); }} className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${activeTemplate === 'boho' ? 'border-rose-400 shadow-md' : 'border-transparent hover:border-gray-200 shadow-sm'}`}>
              <div className="bg-orange-50 h-20 p-2 flex flex-col items-center justify-center relative overflow-hidden">
                 <div className="absolute bottom-0 w-16 h-16 rounded-t-full" style={{ backgroundColor: themeColors.accent, opacity: 0.2 }}></div>
                 <span className="font-sans font-medium text-sm z-10" style={{ color: themeColors.primaryText }}>Boho Arco</span>
              </div>
            </div>

            <div onClick={() => { setActiveTemplate('classic'); setAddedElements([]); }} className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${activeTemplate === 'classic' ? 'border-rose-400 shadow-md' : 'border-transparent hover:border-gray-200 shadow-sm'}`}>
              <div className="bg-white h-20 p-2 flex flex-col items-center justify-center relative">
                 <div className="absolute inset-1 border" style={{ borderColor: themeColors.accent }}></div>
                 <div className="absolute inset-2 border" style={{ borderColor: themeColors.accent, opacity: 0.5 }}></div>
                 <span className="font-serif text-sm" style={{ color: themeColors.primaryText }}>Imperial</span>
              </div>
            </div>

            <div onClick={() => { setActiveTemplate('avant-garde'); setAddedElements([]); }} className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${activeTemplate === 'avant-garde' ? 'border-rose-400 shadow-md' : 'border-transparent hover:border-gray-200 shadow-sm'}`}>
              <div className="bg-gray-100 h-20 p-2 flex flex-col items-start justify-center relative">
                 <span className="font-sans font-black text-lg leading-none tracking-tighter" style={{ color: themeColors.primaryText }}>AVANT</span>
                 <span className="font-sans font-black text-lg leading-none tracking-tighter" style={{ color: themeColors.primaryText }}>GARDE</span>
              </div>
            </div>

            <div onClick={() => { setActiveTemplate('photographic'); setAddedElements([]); }} className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${activeTemplate === 'photographic' ? 'border-rose-400 shadow-md' : 'border-transparent hover:border-gray-200 shadow-sm'}`}>
              <div className="bg-gray-800 h-20 p-2 flex flex-col items-center justify-center relative">
                 <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                 <span className="font-sans font-light text-white text-[10px] uppercase relative z-10" style={{ textShadow: `0 2px 4px ${themeColors.primaryText}` }}>Fotográfico</span>
              </div>
            </div>
            </div>

            {/* Botón Importar Canva (SVG) */}
            <div className="col-span-2 mt-2">
              <input type="file" accept=".svg" ref={canvaInputRef} onChange={handleCanvaUpload} className="hidden" />
              <button onClick={() => canvaInputRef.current.click()} className="w-full bg-gradient-to-r from-[#00C4CC] to-[#7D2AE8] text-white rounded-xl p-3 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                <span className="font-bold text-xs uppercase tracking-wide">Importar de Canva (SVG)</span>
              </button>
            </div>
          </div>

          {activeTemplate === 'photographic' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              <button onClick={() => fileInputRef.current.click()} className="w-full bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                Fondo de Pantalla Completa
              </button>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col gap-2">
          {/* Botón de Video Animación */}
          <button 
            onClick={() => setAnimationKey(prev => prev + 1)} 
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all text-xs flex items-center justify-center gap-2 mb-2" 
            title="Ver Animación Mágica"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Previsualizar Video
          </button>
          
          <div className="flex gap-2">
            <button onClick={handleDownloadPNG} className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium shadow-sm hover:bg-gray-50 transition-all text-xs" title="Descargar Imagen Web">
              PNG
            </button>
            <button onClick={handleDownloadPDF} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium shadow-lg hover:bg-gray-800 transition-all text-xs flex items-center justify-center gap-2" title="Descargar Alta Resolución para Imprenta">
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* LIENZO CENTRAL (Canvas - 75%) */}
      <div className="flex-1 bg-gray-100/80 flex items-center justify-center p-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* CONTENEDOR DE CAPTURA (Invitación) - React Key fuerza re-render de las animaciones */}
        <div 
          ref={canvasRef}
          key={animationKey}
          className="w-[450px] h-[650px] shadow-2xl relative overflow-hidden transition-colors duration-500"
          style={{
            backgroundColor: activeTemplate === 'photographic' && backgroundImage ? 'transparent' : themeColors.background,
            backgroundImage: activeTemplate === 'photographic' && backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Capa de textura de papel físico (Global) */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20 z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          ></div>

          {/* Renderizar Elementos Mágicos y Fotos (Auto-Layout) */}
          {addedElements.map((el, index) => (
            <DraggableSVG 
              key={el.id} 
              id={el.id}
              svgType={el.type} 
              color={themeColors.accent} 
              className={el.classes}
              constraintsRef={canvasRef}
              onDelete={handleDeleteElement}
              src={el.src}
              delay={0.1 * index}
            />
          ))}

          {/* 1. BOTÁNICO - Limpio y Personalizable */}
          {activeTemplate === 'botanical' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
              className="absolute inset-0 p-8 flex flex-col items-center text-center"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 0.2, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
                className="absolute inset-5 border border-dashed rounded-sm pointer-events-none z-10" 
                style={{ borderColor: themeColors.accent }}
              ></motion.div>
              
              <div className="flex-1 flex flex-col items-center justify-center w-full z-20 gap-2 mt-4">
                <DraggableText delay={0.2} tag="p" constraintsRef={canvasRef} defaultText={texts.botanicalIntro} className="text-[10px] tracking-[0.3em] uppercase mb-8 font-sans w-full" style={{ color: themeColors.secondaryText }} />
                
                <DraggableText 
                  delay={0.4}
                  tag="h1" 
                  constraintsRef={canvasRef}
                  defaultText={texts.names} 
                  className="text-6xl mb-8 font-serif w-full" 
                  style={{ 
                    fontFamily: fontFamily,
                    backgroundImage: `linear-gradient(135deg, ${themeColors.primaryText} 0%, #FFFFFF 50%, ${themeColors.primaryText} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))'
                  }} 
                />
                
                <DraggableText delay={0.6} tag="p" constraintsRef={canvasRef} defaultText={texts.date} className="text-sm tracking-widest uppercase mb-1 font-medium font-sans w-full" style={{ color: themeColors.primaryText }} />
                <DraggableText delay={0.7} tag="p" constraintsRef={canvasRef} defaultText={texts.year} className="text-xs italic mb-10 font-serif w-full" style={{ color: themeColors.secondaryText, opacity: 0.8 }} />
                
                <DraggableText delay={0.8} tag="p" constraintsRef={canvasRef} defaultText={texts.location} className="text-sm font-sans w-full" style={{ color: themeColors.primaryText }} />
                <DraggableText delay={0.9} tag="p" constraintsRef={canvasRef} defaultText={texts.city} className="text-xs font-sans mt-1 w-full" style={{ color: themeColors.secondaryText, opacity: 0.8 }} />
              </div>
            </motion.div>
          )}

          {/* 2. MINIMALISTA */}
          {activeTemplate === 'minimalist' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
              className="absolute inset-0 p-10 flex flex-col items-center text-center"
            >
              <motion.svg 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
                className="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)] pointer-events-none z-10" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0" y="0" width="100" height="100" stroke={themeColors.accent} strokeWidth="0.5" opacity="0.8" />
                <rect x="2" y="2" width="96" height="96" stroke={themeColors.accent} strokeWidth="0.2" opacity="0.6" />
                <path d="M 0 10 L 10 10 L 10 0" stroke={themeColors.accent} strokeWidth="0.5" opacity="0.8"/>
                <path d="M 90 0 L 90 10 L 100 10" stroke={themeColors.accent} strokeWidth="0.5" opacity="0.8"/>
                <path d="M 0 90 L 10 90 L 10 100" stroke={themeColors.accent} strokeWidth="0.5" opacity="0.8"/>
                <path d="M 100 90 L 90 90 L 90 100" stroke={themeColors.accent} strokeWidth="0.5" opacity="0.8"/>
              </motion.svg>
              
              <div className="flex-1 flex flex-col items-center justify-center w-full z-20 m-4">
                <DraggableText delay={0.2} constraintsRef={canvasRef} tag="p" defaultText={texts.minimalTitle} className="text-[8px] tracking-[0.5em] uppercase mb-12 font-sans w-full" style={{ color: themeColors.secondaryText }} />
                
                <DraggableText 
                  delay={0.4}
                  constraintsRef={canvasRef}
                  tag="h1" 
                  defaultText={texts.minimalGroom} 
                  className="text-4xl tracking-widest font-sans font-light w-full" 
                  style={{ 
                    fontFamily: fontFamily,
                    backgroundImage: `linear-gradient(135deg, ${themeColors.primaryText} 0%, #FFFFFF 50%, ${themeColors.primaryText} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }} 
                />
                <DraggableText delay={0.5} constraintsRef={canvasRef} tag="span" defaultText="&" className="text-3xl my-6 font-serif italic" style={{ color: themeColors.accent }} />
                <DraggableText 
                  delay={0.6}
                  constraintsRef={canvasRef}
                  tag="h1" 
                  defaultText={texts.minimalBride} 
                  className="text-4xl tracking-widest font-sans font-light mb-16 w-full" 
                  style={{ 
                    fontFamily: fontFamily,
                    backgroundImage: `linear-gradient(135deg, ${themeColors.primaryText} 0%, #FFFFFF 50%, ${themeColors.primaryText} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }} 
                />
                
                <div className="flex items-center justify-center gap-4 w-full px-10 relative">
                  <DraggableText delay={0.8} constraintsRef={canvasRef} tag="p" defaultText={texts.minimalDate} className="text-sm tracking-widest font-sans" style={{ color: themeColors.secondaryText }} />
                </div>
                
                <DraggableText delay={0.9} constraintsRef={canvasRef} tag="p" defaultText={texts.minimalLocation} className="text-xs tracking-widest mt-12 mb-2 font-sans w-full" style={{ color: themeColors.primaryText }} />
                <DraggableText delay={1.0} constraintsRef={canvasRef} tag="p" defaultText={texts.minimalTime} className="text-[10px] font-sans uppercase w-full" style={{ color: themeColors.secondaryText, opacity: 0.8 }} />
              </div>
            </motion.div>
          )}

          {/* 3. FOTOGRÁFICO */}
          {activeTemplate === 'photographic' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center overflow-hidden"
            >
              <div className="absolute inset-6 backdrop-blur-md rounded-xl border pointer-events-none z-10" style={{ backgroundColor: `${themeColors.background}B3`, borderColor: `${themeColors.accent}66` }}></div>
              
              {!backgroundImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-20">
                  <span className="text-xl font-light tracking-widest" style={{ color: themeColors.primaryText }}>Sube una foto de fondo</span>
                </div>
              )}

              <div className="relative z-20 w-full flex flex-col items-center justify-center h-full px-4">
                <DraggableText delay={0.2} constraintsRef={canvasRef} tag="p" defaultText={texts.photoIntro} className="text-xs tracking-[0.4em] uppercase mb-10 font-sans font-light opacity-90 w-full" style={{ color: themeColors.secondaryText }}/>
                
                <DraggableText 
                  delay={0.4}
                  constraintsRef={canvasRef}
                  tag="h1" 
                  defaultText={texts.names} 
                  className="text-5xl mb-4 w-full leading-tight" 
                  style={{ 
                    fontFamily: fontFamily, 
                    backgroundImage: `linear-gradient(135deg, ${themeColors.primaryText} 0%, #FFFFFF 50%, ${themeColors.primaryText} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' 
                  }} 
                />
                
                <DraggableText delay={0.6} constraintsRef={canvasRef} tag="p" defaultText={texts.photoAction} className="text-[9px] tracking-[0.3em] uppercase mb-10 font-sans font-light opacity-80 w-full" style={{ color: themeColors.secondaryText }}/>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.8 }}
                  className="px-8 py-4 rounded-lg border w-4/5 mb-6 relative group flex flex-col items-center justify-center pointer-events-none" 
                  style={{ backgroundColor: `${themeColors.background}66`, borderColor: `${themeColors.accent}80` }}
                >
                  <div className="pointer-events-auto w-full flex flex-col items-center">
                    <DraggableText constraintsRef={canvasRef} tag="p" defaultText={texts.photoDateBox} className="text-xl tracking-widest font-light mb-1 font-sans w-full" style={{ color: themeColors.primaryText }} />
                    <DraggableText constraintsRef={canvasRef} tag="p" defaultText={texts.photoTimeBox} className="text-xs font-light opacity-80 font-sans w-full" style={{ color: themeColors.secondaryText }} />
                  </div>
                </motion.div>
                
                <DraggableText delay={1.0} constraintsRef={canvasRef} tag="p" defaultText={texts.photoLocation} className="text-sm font-light tracking-wide font-sans w-full" style={{ color: themeColors.primaryText }} />
              </div>
            </motion.div>
          )}

          {/* PLANTILLA CUSTOM DE CANVA (SVG) */}
          {activeTemplate.startsWith('custom-') && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
              style={{
                '--color-base': themeColors.background,
                '--color-accent': themeColors.accent,
                '--color-primary-text': themeColors.primaryText,
                '--color-secondary-text': themeColors.secondaryText
              }}
            >
              {/* Render del SVG Procesado */}
              <div 
                className="w-full h-full absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: customTemplates.find(t => `custom-${t.id}` === activeTemplate)?.svg || '' }}
              ></div>
              
              {/* Textos por defecto encima */}
              <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-8 gap-4">
                 <DraggableText delay={0.4} tag="h1" constraintsRef={canvasRef} defaultText={texts.names} className="text-5xl font-serif text-center w-full" style={{ fontFamily: fontFamily, color: themeColors.primaryText }} />
                 <DraggableText delay={0.6} tag="p" constraintsRef={canvasRef} defaultText={texts.date} className="text-sm tracking-widest uppercase mt-4 font-sans w-full text-center font-bold" style={{ color: themeColors.primaryText }} />
              </div>
            </motion.div>
          )}

          {/* 4. BOHO - Arco */}
          {activeTemplate === 'boho' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
              className="absolute inset-0 flex flex-col items-center text-center pt-16 overflow-hidden"
            >
              {/* Gran arco de fondo */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1 }}
                className="absolute bottom-0 w-[85%] h-[85%] rounded-t-full pointer-events-none z-0"
                style={{ backgroundColor: `${themeColors.accent}20` }}
              ></motion.div>

              <div className="flex-1 flex flex-col items-center justify-center w-full z-20 gap-2 relative">
                <DraggableText delay={0.2} tag="p" constraintsRef={canvasRef} defaultText={texts.bohoIntro} className="text-[10px] tracking-[0.4em] mb-4 font-sans font-light w-full uppercase" style={{ color: themeColors.secondaryText }} />
                
                <DraggableText 
                  delay={0.4}
                  tag="h1" 
                  constraintsRef={canvasRef}
                  defaultText={texts.names} 
                  className="text-6xl mb-6 font-serif w-full" 
                  style={{ 
                    fontFamily: fontFamily,
                    color: themeColors.primaryText
                  }} 
                />
                
                <DraggableText delay={0.6} tag="p" constraintsRef={canvasRef} defaultText={texts.date} className="text-sm tracking-widest uppercase mb-1 font-sans w-full" style={{ color: themeColors.primaryText }} />
                <DraggableText delay={0.7} tag="p" constraintsRef={canvasRef} defaultText={texts.year} className="text-xs italic mb-10 font-serif w-full" style={{ color: themeColors.secondaryText, opacity: 0.8 }} />
                
                <DraggableText delay={0.8} tag="p" constraintsRef={canvasRef} defaultText={texts.location} className="text-sm font-sans w-full" style={{ color: themeColors.primaryText }} />
                <DraggableText delay={0.9} tag="p" constraintsRef={canvasRef} defaultText={texts.city} className="text-xs font-sans mt-1 w-full" style={{ color: themeColors.secondaryText, opacity: 0.8 }} />
              </div>
            </motion.div>
          )}

          {/* 5. CLÁSICA - Imperial */}
          {activeTemplate === 'classic' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
              className="absolute inset-0 p-8 flex flex-col items-center text-center"
            >
              {/* Doble Marco */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.1 }}
                className="absolute inset-6 border pointer-events-none z-10" 
                style={{ borderColor: themeColors.accent }}
              ></motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
                className="absolute inset-8 border pointer-events-none z-10" 
                style={{ borderColor: themeColors.accent, opacity: 0.5 }}
              ></motion.div>
              
              <div className="flex-1 flex flex-col items-center justify-center w-full z-20 gap-2 mt-8">
                <DraggableText delay={0.2} tag="p" constraintsRef={canvasRef} defaultText={texts.classicInitials} className="text-3xl font-serif w-full mb-6" style={{ color: themeColors.accent }} />
                <DraggableText delay={0.3} tag="p" constraintsRef={canvasRef} defaultText={texts.botanicalIntro} className="text-[9px] tracking-widest uppercase font-sans w-full" style={{ color: themeColors.secondaryText }} />
                
                <DraggableText 
                  delay={0.4}
                  tag="h1" 
                  constraintsRef={canvasRef}
                  defaultText={texts.names} 
                  className="text-5xl my-4 font-serif w-full" 
                  style={{ fontFamily: fontFamily, color: themeColors.primaryText }} 
                />
                
                <DraggableText delay={0.5} tag="p" constraintsRef={canvasRef} defaultText={texts.date} className="text-sm uppercase font-sans w-full mt-4" style={{ color: themeColors.primaryText }} />
                <DraggableText delay={0.6} tag="p" constraintsRef={canvasRef} defaultText={texts.year} className="text-xs font-serif w-full" style={{ color: themeColors.secondaryText, opacity: 0.8 }} />
                
                <DraggableText delay={0.8} tag="p" constraintsRef={canvasRef} defaultText={texts.location} className="text-sm font-sans w-full mt-8" style={{ color: themeColors.primaryText }} />
                <DraggableText delay={0.9} tag="p" constraintsRef={canvasRef} defaultText={texts.city} className="text-xs font-sans mt-1 w-full" style={{ color: themeColors.secondaryText, opacity: 0.8 }} />
              </div>
            </motion.div>
          )}

          {/* 6. AVANT-GARDE - Tipográfico */}
          {activeTemplate === 'avant-garde' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
              className="absolute inset-0 p-10 flex flex-col items-start justify-center text-left"
            >
              <div className="z-20 w-full relative">
                <DraggableText delay={0.1} tag="p" constraintsRef={canvasRef} defaultText={texts.avantGardeLabel} className="text-[10px] tracking-[0.4em] uppercase mb-4 font-sans font-bold w-full text-left" style={{ color: themeColors.accent }} />
                
                <DraggableText 
                  delay={0.3}
                  tag="h1" 
                  constraintsRef={canvasRef}
                  defaultText={texts.minimalGroom} 
                  className="text-7xl font-sans font-black w-full text-left leading-none tracking-tighter" 
                  style={{ fontFamily: fontFamily, color: themeColors.primaryText }} 
                />
                <DraggableText delay={0.4} tag="p" constraintsRef={canvasRef} defaultText="&" className="text-4xl font-serif italic my-2 w-full text-left" style={{ color: themeColors.secondaryText }} />
                <DraggableText 
                  delay={0.5}
                  tag="h1" 
                  constraintsRef={canvasRef}
                  defaultText={texts.minimalBride} 
                  className="text-7xl font-sans font-black mb-12 w-full text-left leading-none tracking-tighter" 
                  style={{ fontFamily: fontFamily, color: themeColors.primaryText }} 
                />
                
                <div className="flex w-full mt-8 gap-4 border-t-2 pt-6" style={{ borderColor: themeColors.accent }}>
                  <div className="flex-1">
                    <DraggableText delay={0.7} tag="p" constraintsRef={canvasRef} defaultText={texts.minimalDate} className="text-sm font-sans font-bold" style={{ color: themeColors.primaryText }} />
                    <DraggableText delay={0.8} tag="p" constraintsRef={canvasRef} defaultText={texts.minimalTime} className="text-[10px] font-sans uppercase mt-1" style={{ color: themeColors.secondaryText }} />
                  </div>
                  <div className="flex-1">
                    <DraggableText delay={0.9} tag="p" constraintsRef={canvasRef} defaultText={texts.minimalLocation} className="text-sm font-sans font-bold" style={{ color: themeColors.primaryText }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Editor;
