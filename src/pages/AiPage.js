import React from 'react'
import { Footer, NormalHeader } from '../components'
import { Link } from 'react-router-dom'
import {ReactComponent as Share} from "../assets/share.svg"


const AiPage = () => {
  return (
    <main className='ai-page'>
        <NormalHeader/>

        <div className="container">
            <div className="top-nav">
            <Link to="/generate"><button>Back</button></Link>


            <div className="utility">


                <Link to="/mypallete" className='goto-pallete'><Share className="go-to-collection"/></Link>


            </div>


            </div>


            <textarea className='ai-input'></textarea>
            <button className='ai-button'>Generate</button>
            <h1 style={{margin: "0 auto", width: "50%"}}>this feature is currently unavailable</h1>


        </div>


        

        <Footer/>
    </main>
  )
}

export default AiPage