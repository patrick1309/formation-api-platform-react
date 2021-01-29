import React, { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

export default function ImageDrop(props) {
  const [files, setFiles] = useState([]);
  const [currentFiles, setCurrentFiles] = useState(props.currentFiles);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*,.pdf",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const handleClickRemoveFile = () => {
    setFiles([]);
  };

  const handleClickRemoveCurrentFile = () => {
    setCurrentFiles([]);
    props.onDeleteCurrentPicture();
  };

  const thumbs = files.map((file) => {
    return (
      <Fragment key={file.name}>
        <div style={thumb}>
          <div style={thumbInner}>
            <img src={file.preview} style={img} />
          </div>
        </div>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleClickRemoveFile}
        >
          Supprimer
        </button>
      </Fragment>
    );
  });

  const thumbsCurrentFiles = currentFiles.map((file) => {
    return (
      <Fragment key={file.name}>
        <div style={thumb}>
          <div style={thumbInner}>
            <img src={file.preview} style={img} />
          </div>
        </div>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleClickRemoveCurrentFile}
        >
          Supprimer
        </button>
      </Fragment>
    );
  });

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));

    if (files.length) {
      handleImageDrop();
    }
  }, [files]);

  const handleImageDrop = () => {
    props.onImageDrop(files);
  };

  return (
    <div className="form-group">
      <label>{props.label}</label>
      {props.error && <p className="invalid-feedback">{props.error}</p>}
      <section>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Déposez votre fichier</p>
        </div>
        {files.length > 0 && <aside style={thumbsContainer}>{thumbs}</aside>}
        {props.currentFiles.length && !files.length && (
          <aside style={thumbsContainer}>{thumbsCurrentFiles}</aside>
        )}
      </section>
    </div>
  );
}
