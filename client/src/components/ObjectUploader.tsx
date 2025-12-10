// Referenced from blueprint:javascript_object_storage
import { useState, useEffect, useRef, useMemo } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react/dashboard-modal";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: (file: any) => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => void;
  buttonClassName?: string;
  children: ReactNode;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const onGetUploadParametersRef = useRef(onGetUploadParameters);
  const onCompleteRef = useRef(onComplete);
  
  // Keep refs up to date
  useEffect(() => {
    onGetUploadParametersRef.current = onGetUploadParameters;
    onCompleteRef.current = onComplete;
  }, [onGetUploadParameters, onComplete]);
  
  const uppy = useMemo(() => {
    const instance = new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize,
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: (file) => onGetUploadParametersRef.current(file),
      })
      .on("complete", (result) => {
        onCompleteRef.current?.(result);
        // Clear all files after upload to prevent memory buildup
        setTimeout(() => {
          instance.cancelAll();
        }, 100);
        setShowModal(false);
      });
    
    return instance;
  }, [maxNumberOfFiles, maxFileSize]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      uppy.cancelAll();
    };
  }, [uppy]);

  const handleOpenModal = () => {
    // Clear any previous files before opening
    uppy.cancelAll();
    setShowModal(true);
  };

  return (
    <div>
      <button onClick={handleOpenModal} className={buttonClassName} type="button" data-testid="button-upload-logo">
        {children}
      </button>

      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => {
          uppy.cancelAll();
          setShowModal(false);
        }}
        proudlyDisplayPoweredByUppy={false}
      />
    </div>
  );
}
