import { Footer, NormalHeader, SnackFail, SnackSuccess } from "../components"
import { Link } from "react-router-dom"
import { useDropzone } from 'react-dropzone';
import { useState, useEffect, useContext} from "react";
import { UserContext } from "../context/UserContext";
import {ReactComponent as Plus} from "../assets/plus.svg"
import {ReactComponent as Minus} from "../assets/minus.svg"
import ColorThief from 'colorthief';
import {ReactComponent as Share} from "../assets/share.svg"
import isDarkColor from 'is-dark-color'
var convert = require('color-convert');




const ImagePage = () => {


  const {username, login, favPallete, setFavPallete} = useContext(UserContext)


  const [uploadedImage, setUploadedImage] = useState(null);
  const [palette, setPalette] = useState([]);
  const [colorCount, setColorCount] = useState(4);


  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
  const [text, setText] = useState("")
  let timer;
 
  const [loading, setLoading] = useState(false)


  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();


    reader.onload = () => {
      setUploadedImage(reader.result);
      getColorPalette(reader.result);
    };


    reader.readAsDataURL(file);
  };


  const getColorPalette = (imageURL, count) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageURL;


    image.onload = () => {
      const colorThief = new ColorThief();
      const newPalette = colorThief.getPalette(image, count);
      const hexPallete = []
      for(let i = 0; i<newPalette.length; i++){
        let color = `#${convert.rgb.hex(newPalette[i])}`
        hexPallete.push(color)
      }


      setPalette(hexPallete);
    };
  };


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });


  function plus() {
    if(colorCount < 8){
      setColorCount(colorCount + 1);
    }
  }


  function min() {
    if(colorCount > 3){
      setColorCount(colorCount - 1);
    }
  }


  useEffect(() => {
    console.log(colorCount);
    getColorPalette(uploadedImage, colorCount);
  }, [colorCount, uploadedImage]);


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };


  function save(){
    const data = {pallete : palette,
                  username: username}


    setLoading(true)


    fetch("https://colorgen-api.onrender.com/save",{
      method: "POST",
      headers:{
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response=>{
      if(response.ok){
        return response.json()
      }else{
        setLoading(false)
      }
    })
    .then(data =>{
      console.log(data.type)
      if(data.type === "success"){
        setLoading(false)


        console.log(typeof data.dbPallette)


        let palette = []
        for(let i = 0; i<data.dbPallette.length; i++){
          palette.push(data.dbPallette[i])
        }


        setFavPallete(palette)
        console.log(favPallete)
        console.log(typeof favPallete)


        setText(data.exp)
        setSuccess(true)


      }else{
        setLoading(false)
        setFail(true)
        setText(data.exp)
      }
    })
    .catch(error=>{
      console.log(error)
      setLoading(false)
      setFail(true)
      setText("sorry something went wrong")
    })
  }


  function notYetLogin(){
    setFail(true)
    setText("Plaese login")
  }


  useEffect(()=>{
    if(fail || success){
      setTimeout(()=>{
        setFail(false)
        setSuccess(false)
        setText("")
      },1000)
      return () => clearTimeout(timer)
    }
  }, [success, fail])


 


  return (
    <main className="image-pallete">
      <NormalHeader/>


    <div className="container">
        <div className="top-nav">
          <Link to="/generate"><button>Back</button></Link>


          <div className="utility">


              <Link to="/mypallete" className='goto-pallete'><Share className="go-to-collection"/></Link>


          </div>


        </div>
      </div>


     
      <div {...getRootProps()} className="box">
        <input {...getInputProps()} />
        <p>Drag and drop a file here, or click to select a file</p>
      </div>
      {uploadedImage && (
        <div className="img-palette">
          <img src={uploadedImage} alt="Uploaded" style={{width: '100%', maxHeight: '500px', objectFit: 'contain', margin: "0 auto" }} />
         
          <div>
            <h3 style={{width:"200px", margin: "0 auto", marginBottom:"1em", textAlign: "center" }}>Color Palette</h3>




            <div className="palette-container" style={{ margin: "0 auto"}}>
             
            {palette.map((Pallete)=>(
                <div className="each-color" style={{backgroundColor: `${Pallete}`}} onClick={() => copyToClipboard(Pallete)}>
                  <p style={{ color : isDarkColor(Pallete) ? "white" : "black"}}>{`${Pallete}`}</p>
                </div>
            ))}
            </div>


           


            <div className="picked-color">
            {palette.map((color, index) => (
            <div key={index} style={{ backgroundColor: `${color}`}} className="picked"></div>
            ))}
                           
              {
                login ? (
                  loading ? (
                    <span class="loader"></span>
                  ) : (
                    <button onClick={save}>Save</button>
                  )
                ) : (
                  <button onClick={notYetLogin}>Save</button>
                )
              }
             
            </div>


            <div className="counter">
                <Plus onClick={plus} className="plus" style={{cursor: "pointer"}}/>
                <div className="number" style={{ pointerEvents: 'none', userSelect: 'none' }}>{colorCount}</div>
                <Minus onClick={min} className="minus" style={{cursor: "pointer"}}/>
              </div>
          </div>


        </div>
      )}
     


      <Footer/>
      {success && <SnackSuccess text={text}/>}
      {fail && <SnackFail text={text}/>}


    </main>
  )
}
export default ImagePage

