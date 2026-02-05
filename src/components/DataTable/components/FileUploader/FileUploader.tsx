import { useRef } from "react";
import styles from "./FileUploader.module.css";
import { toast } from "react-hot-toast";
interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  setBase64: (base64: string | null) => void;
  errors: { [key: string]: string } | null;
  setErrors: (errors: { [key: string]: string } | null) => void;
  setLoading: (loading: boolean) => void;
  onFileExists?: (file: File, base64: string) => void;
  setExistingFileId?: (id: string | null) => void;
}

export const FileUploader = ({
  file,
  setFile,
  setBase64,
  errors,
  setErrors,
  setLoading,
  onFileExists,
  setExistingFileId,
}: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const checkIfFileExists = async (fileName: string) => {
    try {
      const res = await window.parent!.formApi!.isFileExist(fileName);
      if (res && setExistingFileId && res !== "") {
        setExistingFileId(res);
      }
      return res === "" ? false : true;
    } catch (err) {
      console.error("Error al verificar existencia del archivo:", err);
      toast.error("Error al verificar existencia del archivo");
    }
  };

  const handleFile = async (selectedFile: File) => {
    setLoading(true);
    const encoded = await fileToBase64(selectedFile);
    setFile(selectedFile);
    setBase64(encoded);
    setErrors({ ...errors, file: "" });

    const exists = onFileExists && (await checkIfFileExists(selectedFile.name));
    setLoading(false);

    if (exists && onFileExists) {
      onFileExists(selectedFile, encoded);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    await handleFile(e.target.files[0]);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files?.length) return;
    await handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <div
        className={styles.dropZone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <button
          type="button"
          className={styles.selectBtn}
          onClick={() => fileInputRef.current?.click()}
        >
          Seleccionar archivo
        </button>
        <p>{file ? file.name : "o arrastra un archivo aquí"}</p>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileInput}
        />
      </div>
      {errors?.file && <span className={styles.error}>{errors.file}</span>}
    </div>
  );
};
