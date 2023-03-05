import React, { useRef, useState, useEffect } from "react";
import { uploadImage } from "../../api/contentApi";
import Label from "../Label";
import "./form.css";

const API_URL = `${process.env.REACT_APP_HOST_URL}/content`;
const UPLOAD_ENDPOINT = "file-upload";


//CK Editor
export function Editor({fileUploading , setFileUploading, editorData, setEditorData, label, ...props }) {
  let editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  let [loaded, setLoaded] = useState(false);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };

    setLoaded(true);
  }, []); // run on mounting

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            setFileUploading(true);
            body.append("image", file);
            fetch(`${API_URL}/${UPLOAD_ENDPOINT}`, {
              method: "post",
              body: body,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
              .then((res) => res.json())
              .then((res) => {
                resolve({
                  default: `${res.data.currentFolder.path}/${res.data.currentFolder.url}${res.data.fileName}`
                });
                setFileUploading(false);
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      }
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  if (loaded) {
    return (
      <div className="mt-2">
        <Label title={label} {...props} />
        <CKEditor
          editor={ClassicEditor}
          data={editorData}
          onReady={(editor) => {
          }}
          onChange={(event, editor) => {
            // do something when editor's content changed
            const data = editor.getData();
            setEditorData(data);
          }}
          config={{
            extraPlugins: [uploadPlugin]
          }}
          onBlur={(event, editor) => {}}
          onFocus={(event, editor) => {}}
          autoComplete="off"
          style={{ minHeight: "280px" }}
        />
      </div>
    );
  } else {
    return <h2> Editor is loading </h2>;
  }
}
