import React, { useRef, useState, useCallback } from 'react';
import { FaUpload, FaFile, FaImage, FaVideo, FaFileAlt, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import clsx from 'clsx';
import { Theme, themes } from '../../constants/theme.constants';

export interface DropzoneProps {
  // Funcionalidad básica
  onDrop: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // en bytes
  maxFiles?: number;
  
  // Personalización
  label?: string;
  description?: string;
  theme?: Theme;
  showPreview?: boolean;
  
  // Estados
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  
  // Clases personalizadas
  className?: string;
  previewClassName?: string;
}

type FileWithPreview = {
  file: File;
  preview: string;
  type: 'image' | 'video' | 'other';
};

const Dropzone: React.FC<DropzoneProps> = ({
  onDrop,
  accept = 'image/*',
  multiple = true,
  maxSize = 5 * 1024 * 1024, // 5MB por defecto
  maxFiles = 5,
  label = 'Arrastra y suelta archivos aquí',
  description = 'o haz clic para seleccionar archivos',
  theme = 'primary',
  showPreview = true,
  disabled = false,
  error = false,
  errorMessage = 'Ha ocurrido un error',
  className,
  previewClassName,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Extraer el color del tema
  const themeColor = themes[theme].split(' ').find(cls => cls.startsWith('text-'))?.replace('text-', '') || 'cyan-500';
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);
  
  const validateFiles = useCallback((fileList: File[]): { valid: File[], error: string | null } => {
    let validFiles: File[] = [];
    let errorMsg: string | null = null;
    
    // Verificar número máximo de archivos
    if (!multiple && fileList.length > 1) {
      return { valid: [], error: 'Solo puedes subir un archivo' };
    }
    
    if (multiple && maxFiles && fileList.length > maxFiles) {
      return { valid: [], error: `No puedes subir más de ${maxFiles} archivos` };
    }
    
    // Verificar cada archivo
    for (const file of fileList) {
      // Verificar tipo de archivo
      const fileType = file.type;
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isAccepted = acceptedTypes.some(type => {
        if (type === '*') return true;
        if (type.endsWith('/*')) {
          const mainType = type.replace('/*', '');
          return fileType.startsWith(mainType);
        }
        return fileType === type;
      });
      
      if (!isAccepted) {
        errorMsg = `Tipo de archivo no aceptado: ${file.name}`;
        continue;
      }
      
      // Verificar tamaño
      if (file.size > maxSize) {
        errorMsg = `El archivo ${file.name} excede el tamaño máximo de ${(maxSize / (1024 * 1024)).toFixed(2)}MB`;
        continue;
      }
      
      validFiles.push(file);
    }
    
    return { valid: validFiles, error: errorMsg };
  }, [accept, maxSize, multiple, maxFiles]);
  
  const processFiles = useCallback((fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    const { valid, error } = validateFiles(filesArray);
    
    if (error) {
      setFileError(error);
      return;
    }
    
    setFileError(null);
    
    // Crear previsualizaciones
    const newFiles = valid.map(file => {
      let type: 'image' | 'video' | 'other' = 'other';
      let preview = '';
      
      if (file.type.startsWith('image/')) {
        type = 'image';
        preview = URL.createObjectURL(file);
      } else if (file.type.startsWith('video/')) {
        type = 'video';
        preview = URL.createObjectURL(file);
      }
      
      return { file, preview, type };
    });
    
    if (multiple) {
      setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles));
    } else {
      setFiles(newFiles.slice(0, 1));
    }
    
    onDrop(valid);
  }, [validateFiles, multiple, maxFiles, onDrop]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [disabled, processFiles]);
  
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);
  
  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      
      // Liberar la URL del objeto
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FaImage />;
    if (fileType.startsWith('video/')) return <FaVideo />;
    return <FaFileAlt />;
  };
  
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {/* Dropzone area */}
      <div
        className={clsx(
          'relative border-2 border-dashed rounded-lg p-6 transition-all',
          'flex flex-col items-center justify-center text-center',
          isDragging && !disabled && `border-${themeColor} bg-${themeColor}/5`,
          disabled && 'opacity-60 cursor-not-allowed',
          error || fileError ? 'border-red-500 bg-red-500/5' : `border-${themeColor}/30`,
          'hover:bg-neutral-800/30 cursor-pointer'
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
        />
        
        <div className={clsx(
          'text-4xl mb-3',
          error || fileError ? 'text-red-500' : `text-${themeColor}`
        )}>
          {error || fileError ? (
            <FaExclamationTriangle />
          ) : (
            <FaUpload />
          )}
        </div>
        
        <h4 className="text-lg font-medium text-white mb-1">{label}</h4>
        <p className="text-sm text-gray-400">{description}</p>
        
        {(accept !== '*') && (
          <p className="text-xs text-gray-500 mt-2">
            Tipos aceptados: {accept.split(',').join(', ')}
          </p>
        )}
        
        <p className="text-xs text-gray-500">
          Tamaño máximo: {(maxSize / (1024 * 1024)).toFixed(2)}MB
        </p>
        
        {(error || fileError) && (
          <p className="text-sm text-red-500 mt-2">
            {errorMessage || fileError}
          </p>
        )}
      </div>
      
      {/* File previews */}
      {showPreview && files.length > 0 && (
        <div className={clsx(
          'grid gap-3 mt-2',
          multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1',
          previewClassName
        )}>
          {files.map((file, index) => (
            <div 
              key={`${file.file.name}-${index}`}
              className="relative group bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700"
            >
              {/* Preview */}
              <div className="aspect-square flex items-center justify-center p-2">
                {file.type === 'image' ? (
                  <img 
                    src={file.preview || "/placeholder.svg"} 
                    alt={file.file.name}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                ) : file.type === 'video' ? (
                  <video 
                    src={file.preview}
                    controls
                    className="max-h-full max-w-full object-contain rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <div className="text-3xl mb-2">
                      {getFileIcon(file.file.type)}
                    </div>
                    <span className="text-xs text-center break-all line-clamp-2">
                      {file.file.name}
                    </span>
                  </div>
                )}
              </div>
              
              {/* File info */}
              <div className="p-2 text-xs bg-neutral-900">
                <p className="truncate">{file.file.name}</p>
                <p className="text-gray-400">
                  {(file.file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              
              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className={clsx(
                  'absolute top-2 right-2 bg-neutral-900/80 rounded-full p-1',
                  'text-white opacity-0 group-hover:opacity-100 transition-opacity',
                  'hover:bg-red-500'
                )}
                aria-label="Eliminar archivo"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropzone;
