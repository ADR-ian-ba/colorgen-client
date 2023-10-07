import isDarkColor from 'is-dark-color'
import { Tooltip } from '@mui/material';
import { UserContext } from "../context/UserContext"
import { useContext, useEffect, useState } from "react"
import { SnackFail, SnackSuccess } from "../components"

const Pallete = (props) => {

  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
  const [text, setText] = useState("")
  const [view, setView] = useState(false)
  const {username, favPallete, setFavPallete} = useContext(UserContext)
  let timer;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

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

  useEffect(() => {
    console.log('Updated favPallete:', favPallete);
  }, [favPallete]);

  function deletePallette(){
    const data = {
      id : props.id,
      username: username
    }

    fetch("http://localhost:4000/deletepallette", {
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify(data)
    })
    .then(response=>{
      if(response.ok){
        return response.json()
      }else{

      }
    })
    .then(data=>{
      if(data.type === "success"){
        console.log(typeof data.dbPallette)

        let palette = []
        for(let i = 0; i<data.dbPallette.length; i++){
          palette.push(data.dbPallette[i])
        }

        setFavPallete(palette)
        console.log(favPallete)
        console.log(typeof favPallete)


      }else{

      }
    })
    .catch(error=>{
      console.log(error)
    })

  }

  function copy(){
      navigator.clipboard.writeText(props.hexList)
      setSuccess(true)
      setText("palette copied") 
  }

  return (
    <div className="every-each-pallete">

        <div className="container-each">
            {props.hexList.map((hex)=>(
                <div className="each-pallete" style={{backgroundColor: hex}} onClick={() => copyToClipboard(hex)}>
                  <p style={{ color : isDarkColor(hex) ? "white" : "black"}} >{hex}</p>
                </div>
            ))} 
        </div>
        
        <div className="container-utility">

          <Tooltip title="Copy" className="icon"arrow onClick={copy}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onClick={copy}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>

          </Tooltip>

          <Tooltip title="View" className="icon"arrow>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={()=> setView(!view)}>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="#000000"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C17.5915 3 22.2898 6.82432 23.6219 12C22.2898 17.1757 17.5915 21 12 21C6.40848 21 1.71018 17.1757 0.378052 12C1.71018 6.82432 6.40848 3 12 3ZM12 19C7.52443 19 3.73132 16.0581 2.45723 12C3.73132 7.94186 7.52443 5 12 5C16.4756 5 20.2687 7.94186 21.5428 12C20.2687 16.0581 16.4756 19 12 19Z" fill="#000000" />
            </svg>
          </Tooltip>

          <Tooltip title="Delete" className="icon" onClick={deletePallette} arrow>
            <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon">
              <g id="Menu / Close_MD">
                <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
            </svg>
          </Tooltip>
        </div>

        {view && 
          <>
            <div className='view'></div>
            <div className='color-dialog'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" onClick={()=>setView(!view)}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>

              <div className='view-palette-container'>
                {props.hexList.map((hex)=>(
                  <div className="view-palette" style={{backgroundColor: hex}} onClick={() => copyToClipboard(hex)}>
                    <p style={{ color : isDarkColor(hex) ? "white" : "black"}} >{hex}</p>
                  </div>
                ))}
              </div>



            </div>
          </>

        }

        {success && <SnackSuccess text={text}/>}
        {fail && <SnackFail text={text}/>}


    </div>

  )
}
export default Pallete

//props.hexList is a list

{/* <Tooltip  title={<p style={{fontSize: "20px", height:"fit-content", margin:"0"}}>{hex}</p>} placement="top" followCursor>
</Tooltip> */}
