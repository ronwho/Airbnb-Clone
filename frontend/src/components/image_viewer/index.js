import React, {useState} from "react";
import "../../generic_styles.css";
import "./styles.css";
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import 'react-image-gallery/styles/css/image-gallery.css';

function ImageViewer(props) {
    const [index, setIndex] = useState(0);

    function imageControls(){
        return(
            <>
            <br/>
            <div className="flex-spaced">
                <button onClick={() => {
                    if(index > 0) {
                        setIndex(index - 1);
                    }
                    else{
                        setIndex(props.image_urls.length - 1);
                    }
                }}>Previous</button>
                <span>Image {index+1} out of {props.image_urls.length}</span>
                <button onClick={() => {
                    if(index < props.image_urls.length - 1) {
                        setIndex(index + 1);
                    }
                    else{
                        setIndex(0);
                    }
                }}>Next</button>
            </div>
            </>
        );
    }

    if(props.deleteImage){
        return (
            <div>
                <a className="orange-underline-button medium float-right" onClick={() => {
                    props.deleteImage(props.image_urls[index]);
                    if(index > 0) {
                        setIndex(index - 1);
                    }
                    else{
                        setIndex(props.image_urls.length - 1);
                    }
                }}>Delete</a>
                <img src={props.image_urls[index]} width="100%" height="100%"/>
                {imageControls()}
            </div>
        );
    }

    return (
        <div>
            <img src={props.image_urls[index]} width="100%" height="100%"/>
            {imageControls()}
        </div>
    );
}

export default ImageViewer;