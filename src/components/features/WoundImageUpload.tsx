import React, { useState, useCallback } from 'react';
import { Button, Card, Alert } from '../../design-system/components';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';

interface WoundImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  selectedImage?: File | null;
  previewUrl?: string | null;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  disabled?: boolean;
  className?: string;
}

const WoundImageUpload: React.FC<WoundImageUploadProps> = ({
  onImageSelect,
  onImageRemove,
  selectedImage,
  previewUrl,
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'],
  disabled = false,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `Please select a valid image file (${acceptedTypes.map(type => type.split('/')[1]).join(', ')})`;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `Image file is too large. Please select an image smaller than ${maxSize}MB`;
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onImageSelect(file);
  }, [onImageSelect, maxSize, acceptedTypes]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect, disabled]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRemove = useCallback(() => {
    setError(null);
    onImageRemove();
  }, [onImageRemove]);

  const hasImage = selectedImage || previewUrl;

  return (
    <div className={className}>
      {error && (
        <Alert variant="error" title="Upload Error" description={error} className="mb-4" />
      )}

      <Card className="p-0 overflow-hidden">
        {!hasImage ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={disabled}
            />
            
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                {dragActive ? (
                  <Upload className="w-8 h-8 text-blue-500" />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {dragActive ? 'Drop your image here' : 'Upload wound image'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your image here, or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Supports: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} • Max {maxSize}MB
                </p>
              </div>
              
              <Button
                variant="outline"
                leftIcon={<Upload className="w-4 h-4" />}
                disabled={disabled}
              >
                Choose Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Wound preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {selectedImage?.name || 'Image selected'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={disabled}
                className="bg-white/90 hover:bg-white shadow-sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedImage?.name || 'Image uploaded'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedImage ? `${(selectedImage.size / 1024 / 1024).toFixed(2)} MB` : 'Ready for analysis'}
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled}
                >
                  Change Image
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export { WoundImageUpload };
