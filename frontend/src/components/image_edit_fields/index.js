import React from "react";
import "../../generic_styles.css";
import "./styles.css";
import ImageUploader from '../../components/image_uploader/index.js';
import ImageViewer from "../../components/image_viewer/index.js";


function ImageEditFields(props) {
    var images = props.image_urls.map((url) => {
        return {
            original: url,
            thumbnail: url
        }
    });
    return(
        <>        
        <ImageViewer image_urls={props.image_urls} />
        <ImageUploader image_files={props.image_files} setImageFiles={props.setImageFiles} image_urls={props.image_urls} setImageUrls={props.setImageUrls} />
        </>
    );
}

export default ImageEditFields;