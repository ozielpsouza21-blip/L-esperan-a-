import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCw, Check, RotateCcw, Smartphone, Upload, AlertCircle } from 'lucide-react';

interface InAppCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: 'gallery' | 'child' | 'carousel' | 'media916' | 'profile' | 'family_profile' | 'sponsor_profile' | 'edit_profile' | 'new_sponsor' | 'new_family' | 'photo_editor' | 'edit_child_modal';
  onSavePhoto: (dataUrl: string, target: any) => void;
  onNotify: (msg: string) => void;
}

export const InAppCameraModal: React.FC<InAppCameraModalProps> = ({
  isOpen,
  onClose,
  target,
  onSavePhoto,
  onNotify,
}) => {
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [aspectRatio, setAspectRatio] = useState<'4:3' | '1:1' | '9:16' | '16:9'>('4:3');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashEffect, setFlashEffect] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startStream = async (mode: 'environment' | 'user' = facingMode) => {
    setIsStarting(true);
    setError(null);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        throw new Error('Acesso direto à câmera não suportado. Use o botão de Câmera do Celular abaixo.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Erro ao acessar câmera:', err);
      setError(err.message || 'Permissão de câmera necessária.');
    } finally {
      setIsStarting(false);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startStream(facingMode);
    } else {
      stopStream();
    }
    return () => stopStream();
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startStream(next);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      onNotify('Câmera carregando imagem. Aguarde...');
      return;
    }

    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    const canvas = document.createElement('canvas');
    const width = video.videoWidth;
    const height = video.videoHeight;

    if (aspectRatio === '1:1') {
      const min = Math.min(width, height);
      canvas.width = min;
      canvas.height = min;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, (width - min) / 2, (height - min) / 2, min, min, 0, 0, min, min);
      }
    } else if (aspectRatio === '9:16') {
      canvas.width = 720;
      canvas.height = 1280;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const targetRatio = 9 / 16;
        const currentRatio = width / height;
        let sWidth = width, sHeight = height, sx = 0, sy = 0;
        if (currentRatio > targetRatio) {
          sWidth = height * targetRatio;
          sx = (width - sWidth) / 2;
        } else {
          sHeight = width / targetRatio;
          sy = (height - sHeight) / 2;
        }
        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, 720, 1280);
      }
    } else {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
      }
    }

    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setCapturedImage(dataUrl);
      onNotify('📷 Foto capturada com sucesso!');
    } catch {
      onNotify('Erro ao gerar imagem.');
    }
  };

  const handleConfirm = () => {
    if (!capturedImage) return;
    onSavePhoto(capturedImage, target);
    stopStream();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[140] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-[#180E2B] rounded-[32px] overflow-hidden border-2 border-amber-500/50 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-3.5 bg-[#25153A] border-b border-purple-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-pink-600/30 border border-pink-500/40 text-pink-300">
              <Camera className="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white">Câmera Oficial do Aplicativo</h3>
              <p className="text-[10px] text-amber-300">
                Destino: {target === 'gallery' ? 'Galeria Geral' : target === 'carousel' ? 'Banner da Home' : target === 'media916' ? 'Story 9:16' : 'Cadastro'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={toggleCamera}
              className="p-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/30 active:scale-95 transition"
              title="Inverter Câmera"
            >
              <RotateCw className="w-4 h-4 text-amber-300" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/30 active:scale-95 transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Viewfinder or Preview */}
        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between overflow-y-auto">
          {!capturedImage ? (
            <>
              {/* Aspect Ratio Picker */}
              <div className="flex items-center justify-between bg-black/40 px-3 py-1.5 rounded-2xl border border-white/5 text-[10px] font-bold">
                <span className="text-purple-300">Enquadramento:</span>
                <div className="flex items-center space-x-1">
                  {(['4:3', '1:1', '9:16', '16:9'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setAspectRatio(r)}
                      className={`px-2 py-0.5 rounded-lg transition ${
                        aspectRatio === r ? 'bg-amber-500 text-black shadow' : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Video Frame */}
              <div className={`relative w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10 ${
                aspectRatio === '1:1' ? 'aspect-square' :
                aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[380px]' :
                aspectRatio === '16:9' ? 'aspect-[16/9]' : 'aspect-[4/3]'
              }`}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
                {flashEffect && <div className="absolute inset-0 bg-white z-20" />}

                {/* Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none border border-white/20 grid grid-cols-3 grid-rows-3 opacity-30">
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div />
                </div>

                {error && (
                  <div className="absolute inset-0 bg-black/90 p-5 flex flex-col items-center justify-center text-center space-y-2 z-10">
                    <AlertCircle className="w-8 h-8 text-amber-400" />
                    <p className="text-xs text-purple-200">{error}</p>
                    <label className="py-2.5 px-4 rounded-xl bg-amber-500 text-black font-black text-xs cursor-pointer active:scale-95 transition shadow">
                      Câmera Nativa do Celular
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setCapturedImage(reader.result);
                                stopStream();
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Bottom Shutter Controls */}
              <div className="flex items-center justify-around pt-2">
                <label className="p-2.5 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 hover:text-white flex flex-col items-center space-y-1 cursor-pointer active:scale-95 transition">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span className="text-[8px] font-bold">Celular</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setCapturedImage(reader.result);
                            stopStream();
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>

                {/* Shutter Button */}
                <button
                  type="button"
                  onClick={capturePhoto}
                  disabled={isStarting}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 p-1 shadow-2xl active:scale-90 transition flex items-center justify-center"
                >
                  <div className="w-full h-full rounded-full border-2 border-white/80 bg-white/20 flex items-center justify-center">
                    <Camera className="w-7 h-7 text-white drop-shadow" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={toggleCamera}
                  className="p-2.5 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 hover:text-white flex flex-col items-center space-y-1 active:scale-95 transition"
                >
                  <RotateCw className="w-4 h-4 text-pink-400" />
                  <span className="text-[8px] font-bold">Inverter</span>
                </button>
              </div>
            </>
          ) : (
            /* Preview of Captured Image */
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-black/60 max-h-72 flex items-center justify-center">
                <img src={capturedImage} alt="Capturada" className="w-full h-auto max-h-72 object-contain" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg active:scale-95 transition flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Salvar Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCapturedImage(null);
                    startStream(facingMode);
                  }}
                  className="py-3 px-3 rounded-2xl bg-purple-900/70 hover:bg-purple-800 text-purple-200 font-bold text-xs border border-purple-500/30 active:scale-95 transition flex items-center justify-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tirar Outra</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
